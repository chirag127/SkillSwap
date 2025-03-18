const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    getUserProfile,
} = require("../controllers/users");

router.route("/").get(getUsers);

router.route("/profile").get(protect, getUserProfile).put(protect, updateUser);

router.route("/:id").get(getUser).delete(protect, deleteUser);

module.exports = router;
