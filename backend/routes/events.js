const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    attendEvent,
    cancelAttendance,
} = require("../controllers/events");

router.route("/").get(getEvents).post(protect, createEvent);

router
    .route("/:id")
    .get(getEvent)
    .put(protect, updateEvent)
    .delete(protect, deleteEvent);

router.route("/:id/attend").post(protect, attendEvent);

router.route("/:id/cancel").delete(protect, cancelAttendance);

module.exports = router;
