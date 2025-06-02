const express = require("express");
const User = require("../db/userModel");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();

router.get("/list", verifyToken, async (req, res) => {
    try {
        const user = await User.find({}).select("-password");
        if (user) res.status(200).json({ success: true, data: user });
        else res.status(404).json({ success: false, msg: "User not found" });
      } catch (err) {
        res.status(500).json({ success: false, msg: err });
      }
});

router.get("/:userId", verifyToken, async (req, res) => {
  console.log("🚀 ~ router.get ~ req:", req.params.userId);
    try {
        const user = await User.findById(req.params.userId).select("-password");
        if (user) res.status(200).json({ success: true, data: user });
        else res.status(404).json({ success: false, msg: "User not found" });
      } catch (err) {
        res.status(500).json({ success: false, msg: err });
      }
}); 

module.exports = router;
