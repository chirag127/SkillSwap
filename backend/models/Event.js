const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please add an event title"],
        trim: true,
        maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
        type: String,
        required: [true, "Please add a description"],
        maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    location: {
        type: String,
        required: [true, "Please add an event location"],
    },
    date: {
        type: Date,
        required: [true, "Please add event date"],
    },
    time: {
        type: String,
        required: [true, "Please add event time"],
    },
    image: {
        type: String,
        default: "default-event.jpg",
    },
    organizer: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    attendees: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
    ],
    category: {
        type: String,
        required: [true, "Please select a category"],
        enum: [
            "Workshop",
            "Meetup",
            "Skill Share",
            "Community Service",
            "Social",
            "Other",
        ],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Event", EventSchema);
