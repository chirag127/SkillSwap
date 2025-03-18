const Event = require("../models/Event");

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Event.countDocuments();

        // Filter by category if provided
        const filter = {};
        if (req.query.category) {
            filter.category = req.query.category;
        }

        // Filter by date (upcoming events)
        if (req.query.upcoming === "true") {
            filter.date = { $gte: new Date() };
        }

        const events = await Event.find(filter)
            .populate({
                path: "organizer",
                select: "name profileImage",
            })
            .populate({
                path: "attendees",
                select: "name profileImage",
            })
            .sort({ date: 1 })
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
            count: events.length,
            pagination,
            data: events,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate({
                path: "organizer",
                select: "name profileImage email",
            })
            .populate({
                path: "attendees",
                select: "name profileImage",
            });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        res.status(200).json({
            success: true,
            data: event,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private
exports.createEvent = async (req, res) => {
    try {
        // Add organizer to req.body
        req.body.organizer = req.user.id;

        const event = await Event.create(req.body);

        res.status(201).json({
            success: true,
            data: event,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
exports.updateEvent = async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        // Make sure user is event organizer
        if (event.organizer.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to update this event",
            });
        }

        event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: event,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        // Make sure user is event organizer
        if (event.organizer.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to delete this event",
            });
        }

        await event.deleteOne();

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

// @desc    Attend event
// @route   POST /api/events/:id/attend
// @access  Private
exports.attendEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        // Check if user is already attending
        if (event.attendees.includes(req.user.id)) {
            return res.status(400).json({
                success: false,
                message: "Already attending this event",
            });
        }

        // Add user to attendees
        event.attendees.push(req.user.id);
        await event.save();

        res.status(200).json({
            success: true,
            data: event,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// @desc    Cancel attendance
// @route   DELETE /api/events/:id/cancel
// @access  Private
exports.cancelAttendance = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        // Check if user is attending
        if (!event.attendees.includes(req.user.id)) {
            return res.status(400).json({
                success: false,
                message: "Not attending this event",
            });
        }

        // Remove user from attendees
        event.attendees = event.attendees.filter(
            (attendee) => attendee.toString() !== req.user.id
        );
        await event.save();

        res.status(200).json({
            success: true,
            data: event,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};
