import connectDB from "../../../../db/db"
import Transaction from "../../../../db/schema/Transaction"

export async function GET(request) {
  await connectDB();

  try {
    // Sort transactions by timestamp descending (assuming ISO format)
    const transactions = await Transaction.find({}).sort({ timestamp: -1 });
    return new Response(JSON.stringify({ transactions }), { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch transactions" }), { status: 500 });
  }
}
