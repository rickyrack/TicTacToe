const mongoose = require("mongoose");
const colors = require("colors");
require("dotenv").config();

const uri = process.env.MONGO_URI;

const connectDB = async () => {
  mongoose.connect(uri);

  const db = mongoose.connection;

  db.on("error", (error) => console.error(error));
  db.once("open", () => console.log("Connected to Mongoose".magenta));
};

module.exports = connectDB;
