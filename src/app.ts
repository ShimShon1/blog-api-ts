import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import PostsRouter from "./routes/posts";
import IndexRouter from "./routes/index";
import ProtectedPostsRouter from "./routes/postsProtected";
import jwt from "jsonwebtoken";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

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
