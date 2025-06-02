const mongoose = require("mongoose");

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
    date_time: { type: Date, default: Date.now() },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    comments: [commentSchema],
});

const Photo = mongoose.model.Photos || mongoose.model("Photos", photoSchema);

module.exports = Photo;
