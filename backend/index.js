const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const fs = require("fs");
require("dotenv").config();

const User = require("./model/User");
const Post = require("./model/Post");

const app = express();
const upload = multer({ dest: "uploads/" });
const salt = bcrypt.genSaltSync(10);

/* -------------------- MIDDLEWARE -------------------- */

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(__dirname + "/uploads"));

/* -------------------- DB CONNECT -------------------- */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

/* -------------------- AUTH MIDDLEWARE -------------------- */

const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

/* -------------------- ROUTES -------------------- */

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { userName, password } = req.body;
    const userDoc = await User.create({
      userName,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (err) {
    res.status(400).json(err);
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  const userDoc = await User.findOne({ userName });

  if (!userDoc) {
    return res.status(400).json("User not found");
  }

  const passOk = bcrypt.compareSync(password, userDoc.password);

  if (!passOk) {
    return res.status(400).json("Incorrect credentials");
  }

  jwt.sign(
    { id: userDoc._id, userName },
    process.env.JWT_SECRET,
    {},
    (err, token) => {
      if (err) throw err;
      res
        .cookie("token", token, { httpOnly: true })
        .json({ id: userDoc._id, userName });
    }
  );
});

// PROFILE
app.get("/profile", authMiddleware, (req, res) => {
  res.json(req.user);
});

// LOGOUT
app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

// CREATE POST
app.post("/post", authMiddleware, upload.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const ext = originalname.split(".").pop();
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { title, summary, content } = req.body;

  const postDoc = await Post.create({
    title,
    summary,
    content,
    cover: newPath,
    author: req.user.id,
  });

  res.json(postDoc);
});

// UPDATE POST
app.put("/post", authMiddleware, upload.single("file"), async (req, res) => {
  let newPath = null;

  if (req.file) {
    const { originalname, path } = req.file;
    const ext = originalname.split(".").pop();
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { id, title, summary, content } = req.body;
  const postDoc = await Post.findById(id);

  if (!postDoc) return res.status(404).json("Post not found");

  const isAuthor =
    JSON.stringify(postDoc.author) === JSON.stringify(req.user.id);

  if (!isAuthor) {
    return res.status(403).json("You are not the author");
  }

  await postDoc.updateOne({
    title,
    summary,
    content,
    cover: newPath ? newPath : postDoc.cover,
  });

  res.json(postDoc);
});

// GET POSTS
app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["userName"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

// GET SINGLE POST
app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await Post.findById(id).populate("author", ["userName"]));
});

/* -------------------- SERVER -------------------- */

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
