const express = require("express");
const dbLoad = require("./db/dbLoad");
const dbConnect = require("./db/dbConnect");
const cors = require("cors");
// const Post = require("./db/postModel");
const app = express();
const port = 8080;
app.use(cors());

// dbLoad();
dbConnect();

app.use(express.json());

app.listen(port, () => {
  console.log(`Sandbox listening on port ${port}`);
});
