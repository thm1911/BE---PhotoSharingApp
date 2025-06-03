const express = require("express");
const app = express();
const cors = require("cors");


const dbLoad = require("./db/dbLoad");
const dbConnect = require("./db/dbConnect");
const AuthRouter = require("./routes/AuthRouter");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const CommentRouter = require("./routes/CommentRouter");
const { verifyToken } = require("./middleware/auth");

const port = 8080;


// dbLoad();
dbConnect();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use("/admin", AuthRouter);
app.use("/api/user", UserRouter);
app.use("/api/photosOfUser", PhotoRouter);
app.use("/api/commentsOfUser", CommentRouter);
app.use("/uploads", express.static("uploads"));
app.listen(port, () => {
  console.log(`Sandbox listening on port ${port}`);
});

