const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now,
    },
    from: {
        type: String,
        required: true,
        index: true,
    },
    to: {
        type: String,
        required: true,
        index: true,
    },
    amount_usd: {
        type: Number,
        required: true,
        min: 0.01,
    },
    from_country: {
        type: String,
        required: true,
    },
    to_country: {
        type: String,
        required: true,
    },
    risk_score: {
        type: Number,
        min: 0,
        max: 1,
        default: null,
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'completed', 'failed'],
    },
});

// Avoid re-creating model if it already exists
const Transaction =
    mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
