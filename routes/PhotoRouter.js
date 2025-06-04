const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { Photo } = require("../db/photoModel");
const fs = require("fs");
const { uploadSingle } = require("../middleware/uploadFile");

router.get("/list", verifyToken, async (req, res) => {
    try {
        const photos = await Photo.find({})

        const transformPhotos = photos.map((photo) => {
            const transformComments = photo.comments.map((comment) => {
                return {
                    _id: comment._id,
                    photo_id: comment.photo_id,
                    user: comment.user,
                    comment: comment.comment,
                }
            });
            return {
                _id: photo._id,
                user_id: photo.user_id,
                file_name: photo.file_name,
                file_path: photo.file_path,
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

router.get("/photo/:photoId", verifyToken, async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.photoId)
        res.status(200).json({
            success: true,
            data: photo,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
})

router.get("/:userId", verifyToken, async (req, res) => {
    try {
        const photos = await Photo.find({ user_id: req.params.userId })
        const transformPhotos = photos.map((photo) => {
            const transformComments = photo.comments.map((comment) => {
                return {
                    _id: comment._id,
                    photo_id: comment.photo_id,
                    user: comment.user,
                    comment: comment.comment,
                }
            });
            return {
                _id: photo._id,
                user_id: photo.user_id,
                file_name: photo.file_name,
                file_path: photo.file_path,
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
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        const newPhoto = new Photo({
            file_name: req.file.filename,
            file_path: fileUrl,
            user_id: req.body.user_id,
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
            message: "Error upload photo",
        });
    }
});

module.exports = router;