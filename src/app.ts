import express, { NextFunction, Request, Response } from "express";
const mongoose = require("mongoose");
const PostsRouter = require("./routes/posts");
const IndexRouter = require("./routes/index");
const ProtectedPostsRouter = require("./routes/postsProtected");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const PORT = process.env.PORT || 2000;

mongoose.connect(process.env.DB_LINK);
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 2 * 60 * 1000,
    limit: 40,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  })
);

async function verifyUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    res.status;
    const authenticationToken = req.headers["authorization"];
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    if (!verify) {
      return res.status(401).json({ msg: "unauthorized" });
    }
    return next();
  } catch (error) {
    return res.status(401).json({ msg: "unauthorized" });
  }
}

app.use("/api/posts", PostsRouter);
app.use("/api", IndexRouter);

app.use(verifyUser);
app.get("/api/isLogged", (req, res) => {
  return res.json({ logged: true });
});
app.use("/api/protected/posts", ProtectedPostsRouter, verifyUser);

http: app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}/api`);
});
