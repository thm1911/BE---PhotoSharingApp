const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { Comment } = require("../db/commentModel");

router.post("/upload", verifyToken, async (req, res) => {
    try {
        const comment = new Comment({
            comment: req.body.comment,
            photo_id: req.body.photo_id,
            user_id: req.user._id,
        });
        await comment.save();
        res.status(200).json({
            success: true,
            message: "Comment uploaded successfully",
        });
    } catch (error) {
        console.log("❌ Error upload comment:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});


module.exports = router;