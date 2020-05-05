const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
// https://express-validator.github.io/docs/index.html

const User = require("../models/User");

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get(
  "/",
  auth, // runs middleware/auth (send header 'x-auth-token'; pulls out payload and assigns to req.user)
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password"); // remove password, don't want to return it in res
      res.json(user);
    } catch (error) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   POST api/auth
// @desc    Auth user & get token
// @access  Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(), // express-validator rules inside square brackets
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req); // express-validator
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ msg: "There is no user with that email in our database" }); // Question: Should this be wrapped in an error key; like the error msg's from express-validator above???
      }

      const isMatch = await bcrypt.compare(password, user.password); // bcypt.compare(passwordAttempt, corerectDBPassword)

      if (!isMatch) {
        return res.status(400).json({
          msg:
            "The password does not match the user's password in the database",
        });
      }

      // JWT payload
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"), // gets the jwtSecret from config/default.json's jwtSecret key
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.err(err.message);
      res.status(500).send("Sever Error");
    }
  }
);

module.exports = router;
