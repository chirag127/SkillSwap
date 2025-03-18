const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
    getExchanges,
    getExchange,
    createExchange,
    updateExchangeStatus,
    getUserExchanges,
} = require("../controllers/exchanges");

router.route("/").get(protect, getExchanges).post(protect, createExchange);

router.route("/user").get(protect, getUserExchanges);

router
    .route("/:id")
    .get(protect, getExchange)
    .put(protect, updateExchangeStatus);

module.exports = router;
