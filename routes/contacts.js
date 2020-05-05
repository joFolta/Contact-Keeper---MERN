const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../models/User");
const Contact = require("../models/Contact");

// @route   GET api/contacts
// @desc    Get all of a user's contacts
// @access  Private
router.get(
  "/",
  auth, // runs middleware/auth (send header 'x-auth-token'; pulls out payload and assigns to req.user)
  async (req, res) => {
    try {
      const contacts = await Contact.find({ user: req.user.id }).sort({
        date: -1, // sort by newest contact
      });
      res.json(contacts);
    } catch (error) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   POST api/contacts
// @desc    Add new contacts
// @access  Private
router.post("/", (req, res) => {
  res.send("Add contact");
});

// @route   PUT api/contacts/:id
// @desc    Update a contact
// @access  Private
router.put("/:id", (req, res) => {
  res.send("Update contact");
});

// @route   DELETE api/contacts/:id
// @desc    Update a contact
// @access  Private
router.delete("/:id", (req, res) => {
  res.send("Delete contact");
});

module.exports = router;
