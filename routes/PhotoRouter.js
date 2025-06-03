const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { Photo } = require("../db/photoModel");
const fs = require("fs");
const { uploadSingle } = require("../middleware/uploadFile");

router.get("/list", verifyToken, async (req, res) => {
    try {
        const photos = await Photo.find({}).populate({
            path: "comments.user_id",
            model: "Users",
        });

        const transformPhotos = photos.map((photo) => {
            const transformComments = photo.comments.map((comment) => {
                return {
                    _id: comment._id,
                    user_id: comment.user_id,
                    comment: comment.comment,
                }
            });
            return {
                _id: photo._id,
                user_id: photo.user_id,
                file_name: photo.file_name,
                description: photo.description,
                date_time: photo.date_time,
                comments: transformComments,
            }
        });

        res.status(200).json({
            success: true,
            data: transformPhotos,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

router.get("/:id", verifyToken, async (req, res) => {
    try {
        const photos = await Photo.find({ user_id: req.params.id }).populate({
            path: "comments.user_id",
            model: "Users",
        });
        const transformPhotos = photos.map((photo) => {
            const transformComments = photo.comments.map((comment) => {
                return {
                    _id: comment._id,
                    user_id: comment.user_id,
                    comment: comment.comment,
                }
            });
            return {
                _id: photo._id,
                user_id: photo.user_id,
                file_name: photo.file_name,
                description: photo.description,
                date_time: photo.date_time,
                comments: transformComments,
            }
        });

        res.status(200).json({
            success: true,
            data: transformPhotos,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

router.post("/upload", verifyToken, uploadSingle, async (req, res) => {
    try {
        console.log("req.file.path", req.file.path);
        const img = fs.readFileSync(req.file.path);
        const newPhoto = new Photo({
            file_name: req.file.filename,
            file_path: req.file.path,
            user_id: req.user._id,
            description: req.body.description,
        })
        await newPhoto.save();
        res.status(200).json({
            success: true,
            message: "Photo uploaded successfully",
        });
    } catch (error) {
        console.log("❌ Error upload photo:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;