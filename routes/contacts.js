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
      res.status(500).send("Server Error, unable to load contacts");
    }
  }
);

// @route   POST api/contacts
// @desc    Add new contacts
// @access  Private
router.post(
  "/",
  [auth, [check("name", "Please enter contact's name").not().isEmpty()]], // array of [middleware/auth && express-validator check()]
  async (req, res) => {
    // express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, type } = req.body;

    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id, // req.user.id was added by middleware/auth
      });

      const contact = await newContact.save(); // save contact to db

      res.json(contact); // return contact to client
    } catch (error) {
      console.error(err.message);
      res.status(500).send("Server Error; unable to add contact");
    }
  }
);

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
