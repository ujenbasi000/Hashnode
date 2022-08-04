// Connect to mongodb Database. URI is in environment variables.
const mongoose = require("mongoose");

const connect = () => {
  const mongoURI = process.env.NEXT_PUBLIC_MONGODBURI;
  if (mongoURI) {
    mongoose.connect(mongoURI);
    mongoose.connection.once("open", () => {
      console.log("Connected to MongoDB");
    });
  }
};

module.exports = connect;
