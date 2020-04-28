const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
// https://express-validator.github.io/docs/index.html

const User = require("../models/User");

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post(
  "/",
  [
    check("name", "Pleace add name").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "The password must be 5-20 chars long and contain a number"
    )
      .not()
      .isIn(["123", "password", "god"])
      .withMessage("Do not use a common word as the password")
      .isLength({ min: 5, max: 20 })
      .withMessage("Must be 5-20 characters long")
      .matches(/\d/)
      .withMessage("Must contain a number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email: email }); // ES6 shorthand: findOne({ email })

      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      user = new User({
        name: name, // ES6 shorthand: name
        email: email, // ES6 shorthand: email
        password: password, // ES6 shorthand: password
      });

      const salt = await bcrypt.genSalt(10); // bcrypt password encryption/hashing

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      res.send("User saved");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
