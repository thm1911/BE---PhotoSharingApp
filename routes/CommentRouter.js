const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { Comment, Photo } = require("../db/photoModel");

router.post("/post", verifyToken, async (req, res) => {
    try {
        const comment = new Comment({
            comment: req.body.comment,
            photo_id: req.body.photo_id,
            user: req.body.user,
        });
        await comment.save();

        const commentObj = {
            comment: comment.comment,
            user: comment.user,
            date_time: comment.date_time,
            photo_id: comment.photo_id,
        }

        await Photo.findByIdAndUpdate(
            req.body.photo_id,
            { $push: { comments: commentObj } }
        );

        res.status(200).json({
            success: true,
            message: "Comment uploaded successfully",
            data: commentObj,
        });
    } catch (error) {
        console.log("❌ Error upload comment:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});


router.get("/:userId", verifyToken, async (req, res) => {
    try {
        const comments = await Comment.find({ 
            $or: [
                { "user.objectID": new mongoose.Types.ObjectId(req.params.userId)},
                { 
                  $and: [
                    { "user.objectID": { $in: [null, ""] } },
                    { "user._id": req.params.userId }
                  ]
                }
              ]
        });


        res.status(200).json({
            success: true, 
            data: comments, 
        });
    } catch (error) {
        console.log("❌ Error get comments:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});


module.exports = router;