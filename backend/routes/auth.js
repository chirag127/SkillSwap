const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
    register,
    login,
    getMe,
    forgotPassword,
    resetPassword,
    updatePassword,
} = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword", resetPassword);
router.put("/updatepassword", protect, updatePassword);

module.exports = router;
