const express = require("express");
const app = express();
const cors = require("cors");


const dbLoad = require("./db/dbLoad");
const dbConnect = require("./db/dbConnect");
const AuthRouter = require("./routes/AuthRouter");
const { verifyToken } = require("./middleware/auth");

const port = 8080;


// dbLoad();
dbConnect();
app.use(cors());
app.use(express.json());
app.use("/admin", AuthRouter);

app.listen(port, () => {
  console.log(`Sandbox listening on port ${port}`);
});

// app.get("/home", verifyToken, (req, res) => {
//   console.log("check home")
//   try {
//     return res.status(200).json({ success: true, message: "Welcome to Home!" })
//   }
//   catch (error) {
//     return res.status(500).json({ message: error.message })
//   }
// })
