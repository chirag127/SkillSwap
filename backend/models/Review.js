const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    exchange: {
        type: mongoose.Schema.ObjectId,
        ref: "Exchange",
        required: true,
    },
    reviewer: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    reviewee: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        required: [true, "Please add a rating between 1 and 5"],
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: [true, "Please add a review comment"],
        maxlength: [500, "Comment cannot be more than 500 characters"],
    },
    badges: [
        {
            type: String,
            enum: ["Reliable", "Punctual", "Skilled", "Helpful", "Friendly"],
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Prevent user from submitting more than one review per exchange
ReviewSchema.index({ exchange: 1, reviewer: 1 }, { unique: true });

// Static method to calculate average rating
ReviewSchema.statics.getAverageRating = async function (userId) {
    const obj = await this.aggregate([
        {
            $match: { reviewee: userId },
        },
        {
            $group: {
                _id: "$reviewee",
                averageRating: { $avg: "$rating" },
            },
        },
    ]);

    try {
        await this.model("User").findByIdAndUpdate(userId, {
            averageRating: obj[0]
                ? Math.round(obj[0].averageRating * 10) / 10
                : 0,
        });
    } catch (err) {
        console.error(err);
    }
};

// Call getAverageRating after save
ReviewSchema.post("save", function () {
    this.constructor.getAverageRating(this.reviewee);
});

// Call getAverageRating after remove
ReviewSchema.post("remove", function () {
    this.constructor.getAverageRating(this.reviewee);
});

module.exports = mongoose.model("Review", ReviewSchema);
