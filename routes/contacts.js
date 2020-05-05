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

      res.json(contact); // return contact to client (why on a POST?; we have GET api/contacts")
    } catch (error) {
      console.error(err.message);
      res.status(500).send("Server Error; unable to add contact");
    }
  }
);

// @route   PUT api/contacts/:id
// @desc    Update a contact
// @access  Private
router.put(
  "/:id", // URL param
  auth,
  async (req, res) => {
    const { name, email, phone, type } = req.body;

    // Build contact object
    const contactFields = {};
    if (name) contactFields.name = name;
    if (email) contactFields.email = email;
    if (phone) contactFields.phone = phone;
    if (type) contactFields.type = type;

    try {
      let contact = await Contact.findById(req.params.id); // query by URL params
      if (!contact) {
        return res.status(404).json({ msg: "Contact not found" });
      }

      // Make sure user owns contact
      if (contact.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "Not authorized to edit contact" });
      }

      contact = await Contact.findByIdAndUpdate(
        req.params.id, // query by URL params
        { $set: contactFields },
        { new: true }
      );

      res.json(contact); // return contact to client
    } catch (error) {
      console.error(err.message);
      res.status(500).send("Server Error; unable to update contact");
    }
  }
);

// @route   DELETE api/contacts/:id
// @desc    Update a contact
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id); // query by URL params
    if (!contact) {
      return res.status(404).json({ msg: "Contact not found" });
    }

    // Make sure user owns contact
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized to delete contact" });
    }

    await Contact.findByIdAndRemove(req.params.id);

    res.json({ msg: "Contact removed" }); // return contact to client
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server Error; unable to update contact");
  }
});

module.exports = router;
