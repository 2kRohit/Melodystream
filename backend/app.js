require("express-async-errors");
const express = require("express");
const morgan = require("morgan");
const { errorHandler } = require("./middlewares/error");
const cors = require("cors");
const path=require("path")
require("dotenv").config();
require("./db");
const userRouter = require("./routes/user");
const videoRouter = require("./routes/video");
const adminRouter=require('./routes/admin');
const verifierRouter=require('./routes/verifier')
const { handleNotFound } = require("./utils/helper");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use('/uploads/videos', express.static(path.join(__dirname, '../backend/uploads/videos')));
app.use('/uploads/profile', express.static(path.join(__dirname, '../backend/uploads/profile')));
app.use('/uploads/profile', express.static(path.join(__dirname, '../backend/uploads/report')));




app.use("/api/user", userRouter);
app.use("/api/video", videoRouter);
app.use("/api/admin", adminRouter);
app.use("/api/verifier", verifierRouter);
app.use("/*", handleNotFound);

app.use(errorHandler);

// app.post("/sign-in",
//   (req, res, next) => {
//     const { email, password } = req.body
//     if (!email || !password)
//       return res.json({ error: 'email/ password missing!' })
//     next()
//   },
//   (req, res) => {
//     res.send("<h1>Hello I am from your backend about</h1>");
//   });

app.listen(8000, () => {
  console.log("the port is listening on port 8000");
});
