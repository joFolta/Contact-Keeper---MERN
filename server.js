// Using CommonJS's require (can't ES6 import like in React)
const express = require("express");
const connectDB = require("./config/db");
const path = require("path"); // the default NodeJS path module

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

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  ); // * is anything, that is not the above ("/api/users", "/api/auth", "/api/contacts")
  // open index.html
}

const PORT = process.env.PORT || 5000; // process.env.PORT for PROD

app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));
