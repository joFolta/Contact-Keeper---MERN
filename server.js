// Using CommonJS's require (can't import like in React)
const express = require("express");

const app = express();

app.get("/", (req, res) => res.send("Hello World"));

const PORT = process.env.PORT || 5000; // process.env.PORT for PROD

app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));
