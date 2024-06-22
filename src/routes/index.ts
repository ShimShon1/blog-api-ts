import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { loginValidation } from "../validators";
import { validationResult } from "express-validator";
const router = express.Router();
router.post(
  "/login",
  loginValidation,
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await User.findOne({ username: req.body.username });
    if (!user)
      return res
        .status(401)
        .json({ errors: [{ msg: "Incorrect username" }] });
    if (user.password !== req.body.password)
      return res
        .status(401)
        .json({ errors: [{ msg: "Incorrect password" }] });

    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({ user, token });
  }
);

export default router;
