const Review = require("../models/Review");
const Exchange = require("../models/Exchange");
const User = require("../models/User");

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
exports.getReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate({
                path: "reviewer",
                select: "name profileImage",
            })
            .populate({
                path: "reviewee",
                select: "name profileImage",
            })
            .populate({
                path: "exchange",
                populate: {
                    path: "skill",
                    select: "title",
                },
            });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
exports.getReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
            .populate({
                path: "reviewer",
                select: "name profileImage",
            })
            .populate({
                path: "reviewee",
                select: "name profileImage",
            })
            .populate({
                path: "exchange",
                populate: {
                    path: "skill",
                    select: "title",
                },
            });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found",
            });
        }

        res.status(200).json({
            success: true,
            data: review,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// @desc    Add review
// @route   POST /api/reviews
// @access  Private
exports.addReview = async (req, res) => {
    try {
        // Check if exchange exists and is completed
        const exchange = await Exchange.findById(req.body.exchange);

        if (!exchange) {
            return res.status(404).json({
                success: false,
                message: "Exchange not found",
            });
        }

        if (exchange.status !== "completed") {
            return res.status(400).json({
                success: false,
                message: "Cannot review an exchange that is not completed",
            });
        }

        // Check if user is part of the exchange
        if (
            exchange.requester.toString() !== req.user.id &&
            exchange.provider.toString() !== req.user.id
        ) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to review this exchange",
            });
        }

        // Set reviewer and reviewee
        req.body.reviewer = req.user.id;
        req.body.reviewee =
            exchange.requester.toString() === req.user.id
                ? exchange.provider
                : exchange.requester;

        // Check if user already reviewed this exchange
        const existingReview = await Review.findOne({
            exchange: req.body.exchange,
            reviewer: req.user.id,
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this exchange",
            });
        }

        const review = await Review.create(req.body);

        // Update user badges based on review
        if (req.body.badges && req.body.badges.length > 0) {
            const user = await User.findById(req.body.reviewee);

            // Add new badges that don't already exist
            req.body.badges.forEach((badge) => {
                if (!user.badges.includes(badge)) {
                    user.badges.push(badge);
                }
            });

            await user.save();
        }

        res.status(201).json({
            success: true,
            data: review,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res) => {
    try {
        let review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found",
            });
        }

        // Make sure user is review owner
        if (review.reviewer.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to update this review",
            });
        }

        review = await Review.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: review,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found",
            });
        }

        // Make sure user is review owner
        if (review.reviewer.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to delete this review",
            });
        }

        await review.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// @desc    Get reviews for a specific user
// @route   GET /api/reviews/user/:userId
// @access  Public
exports.getUserReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ reviewee: req.params.userId })
            .populate({
                path: "reviewer",
                select: "name profileImage",
            })
            .populate({
                path: "exchange",
                populate: {
                    path: "skill",
                    select: "title",
                },
            });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};
