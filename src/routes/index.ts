const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { loginValidation } = require("../validators");
const { validationResult } = require("express-validator");
router.post(
  "/login",
  loginValidation,
  async function (req, res, next) {
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

module.exports = router;
