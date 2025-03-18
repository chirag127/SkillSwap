const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please add a skill title"],
        trim: true,
        maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
        type: String,
        required: [true, "Please add a description"],
        maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    category: {
        type: String,
        required: [true, "Please select a category"],
        enum: [
            "Education",
            "Home Improvement",
            "Technology",
            "Arts & Crafts",
            "Health & Wellness",
            "Cooking",
            "Gardening",
            "Professional Services",
            "Transportation",
            "Other",
        ],
    },
    hourlyRate: {
        type: Number,
        required: [true, "Please specify the hourly rate in time credits"],
        min: [1, "Hourly rate must be at least 1"],
    },
    availability: {
        type: String,
        required: [true, "Please specify your availability"],
    },
    images: {
        type: [String],
        default: ["default-skill.jpg"],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create index for text search
SkillSchema.index({ title: "text", description: "text", category: "text" });

module.exports = mongoose.model("Skill", SkillSchema);
