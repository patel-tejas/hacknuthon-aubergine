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
    risk_level: {
        type: String,
    },
    loop_detected: {
        type: Boolean,
        default: false
    },
    loop_size: {
        type: Number,
        default: 0
    },
    loop_participants: {
        type: [String],
        default: []
    },
    risk_factors: {
        type: [String],
        default: []
    },
    risk_actions: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'completed', 'failed', 'under_review'],
    },
    full_analysis: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true  // Adds createdAt and updatedAt fields
});

// Add indexes for better query performance
transactionSchema.index({ risk_score: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ loop_detected: 1 });
transactionSchema.index({ 'full_analysis.risk_analysis.score': 1 });

// Avoid re-creating model if it already exists
const Transaction =
    mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;