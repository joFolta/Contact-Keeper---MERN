// Using CommonJS's require (can't ES6 import like in React)
const express = require("express");
const connectDB = require("./config/db");

const app = express();

// Connect Database
connectDB();

// Init Middleware (allows us to POST req.body)
app.use(express.json({ extended: false })); // 3rd party package bodyparser, now included in express

app.get("/", (req, res) =>
  res.json({ msg: "Welcome to the ContactKeeper API" })
);

// Define Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contacts", require("./routes/contacts"));

const PORT = process.env.PORT || 5000; // process.env.PORT for PROD

app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));
