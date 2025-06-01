const express = require("express");
const dbConnect = require("./db/dbConnect");
const cors = require("cors");
const Post = require("./db/postModel");
const app = express();
const port = 8080;
app.use(cors());

dbConnect();
app.use(express.json());

app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find({});
    res.send(posts);
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.post("/post", async (req, res) => {
  console.log(req.body);
  const post = new Post(req.body);
  try {
    await post.save();
    res.send(post);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.get("/post/:slug", async (req, res) => {
  console.log(req.params.slug);
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    res.send(post);
    console.log(post);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

app.delete("/post/:slug", async (req, res) => {
  console.log(req.params.slug);
  try {
    const post = await Post.findOneAndDelete({ slug: req.params.slug });
    if (!post) {
      res.status(404).send("Post wasn't found");
    }
  } catch (error) {
    res.status(500).send({ error });
    console.log(error);
  }
});

app.patch("/post/:slug", async (req, res) => {
  console.log(req.body);
  try {
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      req.body
    );
    await post.save();
    res.send(post);
  } catch (error) {
    res.status(500).send({ error });
    console.log(error);
  }
});

app.post("/api/login", (req, res) => {
  const creds = {
    username: req.body.username,
    password: req.body.password,
  };
  if (creds.username === "admin" && creds.password === "123") {
    res.status(200).send({ message: "Login successful" });
  } else {
    res.status(400).send({ message: "Login failed" });
  }
});

app.listen(port, () => {
  console.log(`Sandbox listening on port ${port}`);
});
