import jwt from "jsonwebtoken";
import User from "../../../../db/schema/User";
import connectDB from "../../../../db/db";
import Transaction from "../../../../db/schema/Transaction";
import mongoose from "mongoose";

async function getTransactionStats(address, session) {
  console.log(`[STATS] Getting stats for address: ${address}`);
  const result = await Transaction.aggregate([
    { $match: { from: address } },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        total: { $sum: "$amount_usd" },
        avg: { $avg: "$amount_usd" }
      }
    }
  ]).session(session);

  console.log(`[STATS] Stats for ${address}:`, result[0] || { count: 0, total: 0, avg: 0 });
  return result[0] || { count: 0, total: 0, avg: 0 };
}

export async function POST(request) {
  console.log("[TRANSACTION] Starting transaction processing");
  await connectDB();

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    console.warn("[AUTH] Missing or invalid authorization header");
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("[AUTH] Decoded token for user ID:", decoded.id);
  } catch (error) {
    console.error("[AUTH] Token verification failed:", error);
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
  }

  const userId = decoded.id;
  console.log("[USER] Processing transaction for user ID:", userId);

  let requestBody;
  try {
    requestBody = await request.json();
    console.log("[REQUEST] Received request body:", requestBody);
  } catch (error) {
    console.error("[REQUEST] Error parsing request body:", error);
    return new Response(JSON.stringify({ error: "Invalid request format" }), { status: 400 });
  }

  const { to, amount_usd, from_country, to_country, timestamp } = requestBody;

  if (!to || !amount_usd || !from_country || !to_country || !timestamp) {
    console.warn("[VALIDATION] Missing required fields:", { 
      to: !!to, 
      amount_usd: !!amount_usd, 
      from_country: !!from_country, 
      to_country: !!to_country, 
      timestamp: !!timestamp 
    });
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }

  const session = await mongoose.startSession();
  let transactionCommitted = false;
  console.log("[DB] Session started");

  try {
    console.log("[DB] Starting transaction");
    await session.startTransaction();

    console.log("[USER] Fetching user:", userId);
    const user = await User.findById(userId).session(session);
    if (!user) {
      console.warn("[USER] User not found:", userId);
      throw new Error("User not found");
    }
    
    const fromAddress = user.username;
    console.log("[TRANSACTION] From address:", fromAddress);

    console.log("[TIME] Parsing timestamp:", timestamp);
    const transactionDate = new Date(timestamp);
    if (isNaN(transactionDate.getTime())) {
      console.error("[TIME] Invalid timestamp format:", timestamp);
      throw new Error("Invalid timestamp format");
    }

    console.log("[STATS] Getting sender stats for:", fromAddress);
    const senderStats = await getTransactionStats(fromAddress, session);
    console.log("[STATS] Getting receiver stats for:", to);
    const receiverStats = await getTransactionStats(to, session);

    const transactionHour = transactionDate.getHours();
    const isMidnight = transactionHour >= 0 && transactionHour < 4 ? 1 : 0;
    console.log("[FEATURES] Calculated time features:", {
      transactionHour,
      isMidnight
    });

    const features = {
      amount_usd: Number(amount_usd),
      from_country,
      to_country,
      hour: transactionHour,
      from_tx_count: senderStats.count,
      from_avg_amount: senderStats.avg,
      from_total_amount: senderStats.total,
      to_tx_count: receiverStats.count,
      to_avg_amount: receiverStats.avg,
      to_total_amount: receiverStats.total,
      is_midnight: isMidnight,
      is_high_amount: amount_usd > 10000 ? 1 : 0,
      is_new_sender: senderStats.count === 0 ? 1 : 0
    };
    console.log("[FEATURES] Final feature set:", features);

    console.log("[RISK] Sending request to risk service");
    const riskResponse = await fetch("https://edfb-2401-4900-8898-3038-e0ff-172c-b122-a0ef.ngrok-free.app/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(features)
    });

    console.log("[RISK] Response status:", riskResponse.status);
    if (!riskResponse.ok) {
      const errorText = await riskResponse.text();
      console.error("[RISK] Assessment failed:", errorText);
      throw new Error(`Risk assessment failed: ${errorText}`);
    }

    console.log("[RISK] Parsing response JSON");
    let riskData;
    try {
      riskData = await riskResponse.json();
      console.log("[RISK] Received risk data:", riskData);
    } catch (e) {
      console.error("[RISK] JSON parse error:", e);
      throw new Error("Invalid JSON from risk service");
    }

    if (!riskData || typeof riskData.combined_risk_score === 'undefined') {
      console.error("[RISK] Invalid response format:", riskData);
      throw new Error("Risk service returned invalid format");
    }

    const { 
      combined_risk_score,
      loop_detected = "no",
      loop_size = 0
    } = riskData;
    console.log("[RISK] Processed risk values:", {
      combined_risk_score,
      loop_detected,
      loop_size
    });

    console.log("[DB] Creating transaction document");
    const newTransaction = new Transaction({
      user: userId,
      from: fromAddress,
      to: to.trim(),
      amount_usd,
      from_country,
      to_country,
      timestamp: transactionDate,
      risk_score: combined_risk_score,
      status: combined_risk_score < 0.7 ? "completed" : "pending"
    });

    console.log("[DB] Saving transaction:", newTransaction);
    await newTransaction.save({ session });

    console.log("[USER] Updating user transactions");
    await User.findByIdAndUpdate(
      userId,
      { $push: { transactions: newTransaction._id } },
      { session }
    );

    console.log("[DB] Committing transaction");
    await session.commitTransaction();
    transactionCommitted = true;

    console.log("[SUCCESS] Transaction processed successfully");
    return new Response(
      JSON.stringify({
        message: "Transaction created successfully",
        transaction: newTransaction,
        risk_data: riskData
      }),
      { 
        status: 201,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("[ERROR] Transaction failed:", error);
    if (!transactionCommitted) {
      console.log("[DB] Aborting transaction");
      await session.abortTransaction();
    }
    return new Response(
      JSON.stringify({ 
        error: error.message || "Transaction processing failed",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined
      }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  } finally {
    console.log("[DB] Ending session");
    session.endSession();
  }
}