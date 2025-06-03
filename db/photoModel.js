const mongoose = require("mongoose");
const { APP_MESSAGES } = require("../constants/message");

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: [true, APP_MESSAGES.COMMENT_REQUIRED]
    },
    date_time: { type: Date, default: Date.now() },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    photo_id: { type: mongoose.Schema.Types.ObjectId, ref: "Photos" },
});

const photoSchema = new mongoose.Schema({
    file_name: {
        type: String,
        required: [true, APP_MESSAGES.FILE_NAME_REQUIRED]
    },
    file_path: {
        type: String,
    },
    description: {
        type: String
    },
    date_time: { type: Date, default: Date.now },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    comments: [commentSchema],
});

const Photo = mongoose.model.Photos || mongoose.model("Photos", photoSchema);
const Comment = mongoose.model.Comments || mongoose.model("Comments", commentSchema);

module.exports = { Photo, Comment };
