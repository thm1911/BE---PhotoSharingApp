const express = require("express");
const User = require("../db/userModel");
const { hashPassword, comparePassword } = require("../utils/cryto");
const { generateToken } = require("../middleware/auth");
const router = express.Router();

router.post("/register", async (req, res) => {
    const {
        username,
        password,
        first_name,
        last_name,
        location,
        description,
        occupation
    } = req.body;
    if (!username || !password || !first_name || !last_name) {
        return res.status(400).json({
            success: false,
            message: "Please enter all fields"
        });
    }
    try {
        const hashedPassword = hashPassword(password);
        // Tạo user mới
        const user = new User({
            username,
            password: hashedPassword,
            first_name,
            last_name,
            location,
            description,
            occupation
        });
        await user.save();
        const token = generateToken(user);
        res.status(200).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                password: user.password,
                first_name: user.first_name,
                last_name: user.last_name,
                location: user.location,
                description: user.description,
                occupation: user.occupation
            }
        });
    } catch (error) {
        console.log("❌ Error register:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Please enter all fields"
        });
    }
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }
        const isPasswordValid = comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }
        const token = generateToken(user);
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                password: user.password,
                first_name: user.first_name,
                last_name: user.last_name,
                location: user.location,
                description: user.description,
                occupation: user.occupation
            }
        });
    } catch (error) {
        console.log("❌ Error login:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.post("/logout", async (req, res) => {
    try {
        res.status(200).json({ success: true, message: "User loged out successfully" });
    } catch (error) {
        console.log("❌ Error logout:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;