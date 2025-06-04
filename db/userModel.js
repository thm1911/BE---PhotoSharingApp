const { APP_MESSAGES } = require("../constants/message");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, APP_MESSAGES.USERNAME_REQUIRED],
        unique: [true, APP_MESSAGES.USERNAME_HAS_ALREADY_BEEN_TAKEN],
        trim: true
    },
    password: {
        type: String,
        required: [true, APP_MESSAGES.PASSWORD_REQUIRED],
        trim: true
    },
    first_name: {
        type: String,
        required: [true, APP_MESSAGES.FIRST_NAME_IS_REQUIRED],
        trim: true
    },
    last_name: {
        type: String,
        required: [true, APP_MESSAGES.LAST_NAME_IS_REQUIRED],
        trim: true
    },
    location: { type: String },
    occupation: { type: String },
    description: { type: String },
},
{ versionKey: false });

const User = mongoose.model.Users || mongoose.model("Users", userSchema);
module.exports = User;
