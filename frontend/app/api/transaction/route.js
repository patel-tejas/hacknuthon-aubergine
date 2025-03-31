import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import connectDB from  "../../../db/db"
import Transaction from "../../../db/schema/Transaction"
export async function GET(request) {
    await connectDB()

    // Authentication check
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }

    const token = authHeader.split(" ")[1]
    let decoded
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        return NextResponse.json(
            { error: "Invalid token" },
            { status: 401 }
        )
    }

    try {
        // Fetch transactions for the logged-in user
        const transactions = await Transaction.find({ user: decoded.id })
            .sort({ timestamp: -1 })
            .lean()

        return NextResponse.json(transactions)
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: "Failed to fetch transactions" },
            { status: 500 }
        )
    }
}