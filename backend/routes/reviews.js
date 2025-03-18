const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
    getReviews,
    getReview,
    addReview,
    updateReview,
    deleteReview,
    getUserReviews,
} = require("../controllers/reviews");

router.route("/").get(getReviews).post(protect, addReview);

router.route("/user/:userId").get(getUserReviews);

router
    .route("/:id")
    .get(getReview)
    .put(protect, updateReview)
    .delete(protect, deleteReview);

module.exports = router;
