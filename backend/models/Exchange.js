const mongoose = require("mongoose");

const ExchangeSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    provider: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    skill: {
        type: mongoose.Schema.ObjectId,
        ref: "Skill",
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "completed", "cancelled", "declined"],
        default: "pending",
    },
    requestMessage: {
        type: String,
        required: [true, "Please provide details about your request"],
        maxlength: [500, "Message cannot be more than 500 characters"],
    },
    responseMessage: {
        type: String,
        maxlength: [500, "Response cannot be more than 500 characters"],
    },
    proposedDate: {
        type: Date,
        required: [true, "Please propose a date for the exchange"],
    },
    duration: {
        type: Number,
        required: [true, "Please specify the expected duration in hours"],
        min: [0.5, "Duration must be at least 30 minutes (0.5 hours)"],
    },
    timeCredits: {
        type: Number,
        required: [true, "Please specify the time credits for this exchange"],
    },
    completedAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Exchange", ExchangeSchema);
