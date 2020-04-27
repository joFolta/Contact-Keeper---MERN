const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI"); // gets the URI (with database username and pwd) from config/default.json's mongoURI key

const connectDB = () => {
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected..."))
    .catch((err) => {
      console.err(err.message);
      process.exit(1);
    });
};

module.exports = connectDB;
