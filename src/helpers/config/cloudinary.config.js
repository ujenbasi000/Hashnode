const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.eventNames.CLOUD_NAME,
  api_key: process.eventNames.API_KEY,
  api_secret: process.eventNames.API_SECRET,
});
module.exports = cloudinary;
