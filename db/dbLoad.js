const mongoose = require('mongoose');
const { hashPassword } = require("../utils/cryto");
const models = require("../modelData/models");
const User = require("../db/userModel");


async function dbLoad() {   
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Successfully connected to MongoDB Atlas!");
    } catch (error) {
        console.log("Unable connecting to MongoDB Atlas!");
    }

    await User.deleteMany({});

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
}

module.exports = dbLoad;