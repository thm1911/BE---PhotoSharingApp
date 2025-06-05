const express = require("express");
const app = express();
const cors = require("cors");
const { Server } = require("socket.io");
const { createServer } = require("http");

const dbLoad = require("./db/dbLoad");
const dbConnect = require("./db/dbConnect");
const AuthRouter = require("./routes/AuthRouter");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const CommentRouter = require("./routes/CommentRouter");
const { verifyToken } = require("./middleware/auth");

// dbLoad();
dbConnect();

app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use("/admin", AuthRouter);
app.use("/api/user", UserRouter);
app.use("/api/photosOfUser", PhotoRouter);
app.use("/api/commentsOfUser", CommentRouter);
app.use("/uploads", express.static("uploads"));

app.listen(8080, () => {
  console.log("server listening on port 8081");
});


const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("sendComment", (data) => {
    console.log("User comment");
    io.emit("newComment", data);
  });

  socket.on("uploadPhoto", (data) => {
    console.log("User upload photo");
    io.emit("newPhoto", data);
  });

  socket.on("deletePhoto", (data) => {
    console.log("User delete photo");
    io.emit("deletedPhoto", data);
  });

  socket.on("updateUser", (data) => {
    console.log("User update information");
    io.emit("newUser", data);
  });
});

server.listen(3001, () => {
  console.log(`Server is running on port 3001`);
});
