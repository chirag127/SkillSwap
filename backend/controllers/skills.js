const Skill = require("../models/Skill");
const User = require("../models/User");

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
exports.getSkills = async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Skill.countDocuments();

        // Filter by category if provided
        const filter = {};
        if (req.query.category) {
            filter.category = req.query.category;
        }

        const skills = await Skill.find(filter)
            .populate({
                path: "user",
                select: "name profileImage averageRating location",
            })
            .skip(startIndex)
            .limit(limit);

        // Pagination result
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit,
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit,
            };
        }

        res.status(200).json({
            success: true,
            count: skills.length,
            pagination,
            data: skills,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// @desc    Get single skill
// @route   GET /api/skills/:id
// @access  Public
exports.getSkill = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id).populate({
            path: "user",
            select: "name profileImage averageRating location bio",
        });

        if (!skill) {
            return res.status(404).json({
                success: false,
                message: "Skill not found",
            });
        }

        res.status(200).json({
            success: true,
            data: skill,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// @desc    Create new skill
// @route   POST /api/skills
// @access  Private
exports.createSkill = async (req, res) => {
    try {
        // Add user to req.body
        req.body.user = req.user.id;

        const skill = await Skill.create(req.body);

        res.status(201).json({
            success: true,
            data: skill,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private
exports.updateSkill = async (req, res) => {
    try {
        let skill = await Skill.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({
                success: false,
                message: "Skill not found",
            });
        }

        // Make sure user is skill owner
        if (skill.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to update this skill",
            });
        }

        skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: skill,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private
exports.deleteSkill = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({
                success: false,
                message: "Skill not found",
            });
        }

        // Make sure user is skill owner
        if (skill.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to delete this skill",
            });
        }

        await skill.deleteOne();

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

// @desc    Get skills for a specific user
// @route   GET /api/skills/user/:userId
// @access  Public
exports.getUserSkills = async (req, res) => {
    try {
        const skills = await Skill.find({ user: req.params.userId });

        res.status(200).json({
            success: true,
            count: skills.length,
            data: skills,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// @desc    Search skills
// @route   GET /api/skills/search
// @access  Public
exports.searchSkills = async (req, res) => {
    try {
        const { query, location, category } = req.query;

        // Build search criteria
        const searchCriteria = {};

        if (query) {
            searchCriteria.$text = { $search: query };
        }

        if (category) {
            searchCriteria.category = category;
        }

        // If location is provided, find users in that location first
        let userIds = [];
        if (location) {
            const users = await User.find({
                location: { $regex: location, $options: "i" },
            }).select("_id");

            userIds = users.map((user) => user._id);

            if (userIds.length > 0) {
                searchCriteria.user = { $in: userIds };
            }
        }

        const skills = await Skill.find(searchCriteria).populate({
            path: "user",
            select: "name profileImage averageRating location",
        });

        res.status(200).json({
            success: true,
            count: skills.length,
            data: skills,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};
