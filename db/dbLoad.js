const mongoose = require('mongoose');
const { hashPassword } = require("../utils/cryto");
const models = require("../modelData/models");
const User = require("../db/userModel");
const { Photo } = require("../db/photoModel");
const { Comment } = require("../db/photoModel");


async function dbLoad() {

  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Successfully connected to MongoDB Atlas!");
  } catch (error) {
    console.log("Unable connecting to MongoDB Atlas!");
  }

  await User.deleteMany({});
  await Photo.deleteMany({});
  await Comment.deleteMany({});

  const mapFakeId2RealId = {};

  const userModels = models.userListModel();
  for (const user of userModels) {
    let username = user.first_name.toLowerCase();
    let password = hashPassword("password");
    userObj = new User({
      username: username,
      password: password,
      first_name: user.first_name,
      last_name: user.last_name,
      location: user.location,
      description: user.description,
      occupation: user.occupation,
    });
    try {
      await userObj.save();
      mapFakeId2RealId[user._id] = userObj._id;
      user.objectID = userObj._id;
      console.log(
        "Adding user:",
        user.first_name + " " + user.last_name,
        " with ID ",
        user.objectID
      );
    } catch (error) {
      console.error("Error create user", error);
    }
  }

  const photoModels = models.photoModel();
  for (const photo of photoModels) {
    photoObj = new Photo({
      file_name: photo.file_name,
      description: photo.description,
      date_time: photo.date_time,
      user_id: mapFakeId2RealId[photo.user_id],
    });

    try {
      await photoObj.save();
      mapFakeId2RealId[photo._id] = photoObj._id;
      photo.objectID = photoObj._id;

      if (photo.comments) {
        for (const comment of photo.comments) {
          let commentObj = new Comment({
            comment: comment.comment,
            date_time: comment.date_time,
            user_id: mapFakeId2RealId[comment.user_id],
            photo_id: photoObj._id,
          });

          photoObj.comments.push(commentObj);
          await photoObj.save();
          try {
            await commentObj.save();
            console.log("Adding comment:", comment.comment, " with ID ", commentObj._id);
          } catch (error) {
            console.error("Error create comment", error);
          }
        }
      }
      console.log("Adding photo:", photo.file_name, " with ID ", photo.objectID);
    } catch (error) {
      console.error("Error create photo", error);
    }
  }
}

module.exports = dbLoad;