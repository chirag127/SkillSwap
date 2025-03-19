const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password, location } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // Create user
        user = await User.create({
            name,
            email,
            password,
            location,
        });

        sendTokenResponse(user, 201, res);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide an email and password",
            });
        }

        // Check for user
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "There is no user with that email",
            });
        }

        // Generate a 6-digit verification code
        const verificationCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        // Hash code and set to resetPasswordToken field
        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(verificationCode)
            .digest("hex");

        // Set expire
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save({ validateBeforeSave: false });

        // Create email message with verification code
        const message = `
            <h1>Password Reset Verification Code</h1>
            <p>You are receiving this email because you (or someone else) has requested the reset of a password.</p>
            <p>Your verification code is:</p>
            <h2 style="text-align: center; font-size: 32px; letter-spacing: 5px; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">${verificationCode}</h2>
            <p>Enter this code in the app to reset your password.</p>
            <p>This code will expire in 10 minutes.</p>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        `;

        // Send email
        const sendEmail = require("../utils/sendEmail");
        await sendEmail(user.email, "SkillSwap Password Reset", message);

        res.status(200).json({
            success: true,
            message: "Password reset email sent",
        });
    } catch (err) {
        console.error("Forgot password error:", err);

        // If there was an error sending email, reset the user's token fields
        try {
            const user = await User.findOne({ email: req.body.email });
            if (user) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpire = undefined;
                await user.save({ validateBeforeSave: false });
            }
        } catch (cleanupErr) {
            console.error("Error cleaning up after email failure:", cleanupErr);
        }

        res.status(500).json({
            success: false,
            message: "Could not send password reset email",
            error: err.message,
        });
    }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword
// @access  Public
exports.resetPassword = async (req, res) => {
    try {
        // Get verification code, email and password from request body
        const { verificationCode, email, password } = req.body;

        if (!verificationCode || !email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Please provide verification code, email and new password",
            });
        }

        // Get hashed verification code
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(verificationCode)
            .digest("hex");

        const user = await User.findOne({
            email,
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code",
            });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("+password");

        // Check current password
        if (!(await user.matchPassword(req.body.currentPassword))) {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            });
        }

        user.password = req.body.newPassword;
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    // In production, secure cookie
    if (process.env.NODE_ENV === "production") {
        options.secure = true;
    }

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            location: user.location,
            timeBalance: user.timeBalance,
            badges: user.badges,
            averageRating: user.averageRating,
        },
    });
};
