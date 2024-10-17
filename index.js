require("dotenv").config();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const corsOptions = require("./src/config/cors");
const connectDB = require("./src/config/database");
const credentials = require("./src/middleware/credentials");
const errorHandlerMiddleware = require("./src/middleware/error_handleware");
const authenticationMiddleware = require("./src/middleware/authentication");

const app = express();
const PORT = 3500;

connectDB();

//Allow multiple
app.use(credentials);

//cors
app.use(cors(corsOptions));
//application url
app.use(express.urlencoded({ extended: false }));

//application response
app.use(express.json());

//middleware cookie
app.use(cookieParser());
app.use(authenticationMiddleware);

//static file
app.use("/static", express.static(path.join(__dirname, "public")));
// Kiểm tra và tạo thư mục nếu không tồn tại
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
//Default error handle
app.use(errorHandlerMiddleware);
//route
app.use("/api/book", require("./src/routes/api/book"));
app.use("/api/author", require("./src/routes/api/author"));
app.use("/api/auth", require("./src/routes/api/auth"));
app.use("/api/publisher", require("./src/routes/api/publisher"));
app.use("/api/borrow", require("./src/routes/api/borrow"));
app.use("/api/comment", require("./src/routes/api/comment"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static("uploads"));

app.all("*", (req, res) => {
  res.status(404);

  if (req.accepts("json")) {
    res.json({ error: "404 not found" });
  } else {
    res.type("text").send("404 not found");
  }
});

mongoose.connection.once("open", () => {
  console.log("DB connected");
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});
