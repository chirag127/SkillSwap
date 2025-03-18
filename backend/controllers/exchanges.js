const Exchange = require("../models/Exchange");
const User = require("../models/User");
const Skill = require("../models/Skill");

// @desc    Get all exchanges
// @route   GET /api/exchanges
// @access  Private
exports.getExchanges = async (req, res) => {
    try {
        const exchanges = await Exchange.find()
            .populate({
                path: "requester",
                select: "name profileImage",
            })
            .populate({
                path: "provider",
                select: "name profileImage",
            })
            .populate("skill");

        res.status(200).json({
            success: true,
            count: exchanges.length,
            data: exchanges,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// @desc    Get single exchange
// @route   GET /api/exchanges/:id
// @access  Private
exports.getExchange = async (req, res) => {
    try {
        const exchange = await Exchange.findById(req.params.id)
            .populate({
                path: "requester",
                select: "name profileImage email phone",
            })
            .populate({
                path: "provider",
                select: "name profileImage email phone",
            })
            .populate("skill");

        if (!exchange) {
            return res.status(404).json({
                success: false,
                message: "Exchange not found",
            });
        }

        // Make sure user is part of the exchange
        if (
            exchange.requester._id.toString() !== req.user.id &&
            exchange.provider._id.toString() !== req.user.id
        ) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to access this exchange",
            });
        }

        res.status(200).json({
            success: true,
            data: exchange,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// @desc    Create new exchange
// @route   POST /api/exchanges
// @access  Private
exports.createExchange = async (req, res) => {
    try {
        // Add requester to req.body
        req.body.requester = req.user.id;

        // Check if skill exists
        const skill = await Skill.findById(req.body.skill);

        if (!skill) {
            return res.status(404).json({
                success: false,
                message: "Skill not found",
            });
        }

        // Set provider from skill
        req.body.provider = skill.user;

        // Calculate time credits based on skill hourly rate and duration
        req.body.timeCredits = skill.hourlyRate * req.body.duration;

        // Check if user has enough time credits
        const user = await User.findById(req.user.id);
        if (user.timeBalance < req.body.timeCredits) {
            return res.status(400).json({
                success: false,
                message: "Not enough time credits",
            });
        }

        // Create exchange
        const exchange = await Exchange.create(req.body);

        res.status(201).json({
            success: true,
            data: exchange,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// @desc    Update exchange status
// @route   PUT /api/exchanges/:id
// @access  Private
exports.updateExchangeStatus = async (req, res) => {
    try {
        let exchange = await Exchange.findById(req.params.id);

        if (!exchange) {
            return res.status(404).json({
                success: false,
                message: "Exchange not found",
            });
        }

        // Make sure user is part of the exchange
        if (
            exchange.requester.toString() !== req.user.id &&
            exchange.provider.toString() !== req.user.id
        ) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to update this exchange",
            });
        }

        // Handle different status updates
        const { status, responseMessage } = req.body;

        // Only provider can accept/decline
        if (
            (status === "accepted" || status === "declined") &&
            exchange.provider.toString() !== req.user.id
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "Only the service provider can accept or decline requests",
            });
        }

        // Only requester can cancel if pending, both can cancel if accepted
        if (status === "cancelled") {
            if (
                exchange.status === "pending" &&
                exchange.requester.toString() !== req.user.id
            ) {
                return res.status(401).json({
                    success: false,
                    message: "Only the requester can cancel a pending exchange",
                });
            }
            if (
                exchange.status === "accepted" &&
                exchange.requester.toString() !== req.user.id &&
                exchange.provider.toString() !== req.user.id
            ) {
                return res.status(401).json({
                    success: false,
                    message:
                        "Only participants can cancel an accepted exchange",
                });
            }
        }

        // Only provider can mark as completed
        if (
            status === "completed" &&
            exchange.provider.toString() !== req.user.id
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "Only the service provider can mark an exchange as completed",
            });
        }

        // Update exchange
        exchange.status = status || exchange.status;
        exchange.responseMessage = responseMessage || exchange.responseMessage;

        if (status === "completed") {
            exchange.completedAt = Date.now();

            // Transfer time credits
            const requester = await User.findById(exchange.requester);
            const provider = await User.findById(exchange.provider);

            requester.timeBalance -= exchange.timeCredits;
            provider.timeBalance += exchange.timeCredits;

            await requester.save();
            await provider.save();
        }

        await exchange.save();

        res.status(200).json({
            success: true,
            data: exchange,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// @desc    Get exchanges for current user
// @route   GET /api/exchanges/user
// @access  Private
exports.getUserExchanges = async (req, res) => {
    try {
        // Get exchanges where user is either requester or provider
        const exchanges = await Exchange.find({
            $or: [{ requester: req.user.id }, { provider: req.user.id }],
        })
            .populate({
                path: "requester",
                select: "name profileImage",
            })
            .populate({
                path: "provider",
                select: "name profileImage",
            })
            .populate("skill")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: exchanges.length,
            data: exchanges,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};
