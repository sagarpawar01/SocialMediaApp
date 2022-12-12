const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require('cors')
const helmet = require("helmet");
const morgan = require("morgan");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const messageRoutes = require("./routes/messages");
const conversationRoutes = require("./routes/conversations");
const multer = require("multer")
const path = require("path")

var port = process.env.PORT || 5000;

dotenv.config();

mongoose
  .connect("mongodb+srv://admin:admin@cluster0.ng5bpkb.mongodb.net/social?retryWrites=true&w=majority",{ useNewUrlParser: true},() => {
      console.log("Connected to MongoDB");
    }
  )
app.use("/images",express.static(path.join(__dirname,"public/images")))

app.use(express.json())
app.use(helmet());
app.use(morgan("common"))
app.use(cors())

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({storage : storage})

app.post("/api/upload",upload.single("file"),(req,res) => {
  console.log('object');
  try {
    return res.status(200).json("file uploaded successfully!!")
  } catch (error) {
    console.log(error);
  }
})

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

//static files
app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(port, () => {
  console.log("Backend is running");
});
