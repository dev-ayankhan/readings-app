const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(
  process.env.MONGODB_URI,
  {
    auth: {
      username: process.env.MONGODB_USER,
      password: process.env.MONGODB_PASS,
    },
  },
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));

module.exports = mongoose;
