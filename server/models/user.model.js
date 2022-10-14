const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    tagline: { type: [{ type: String }], default: [] },
    profile_photo: {
      url: { type: String },
      cloud_id: { type: String },
    },
    cover_image: {
      url: { type: String },
      cloud_id: { type: String },
    },
    bio: {
      available: { type: String },
      about: { type: String },
    },
    skills: { type: [{ type: String }], default: [] },
    social: {
      twitter: { type: String },
      instagram: { type: String },
      github: { type: String },
      stackoverflow: { type: String },
      facebook: { type: String },
      website: { type: String },
      linkedin: { type: String },
      youtube: { type: String },
    },
    following: [{ type: String }],
    followers: [{ type: String }],
    password: { type: String },
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// create a method that generate token
UserSchema.methods.tokenCreation = function (id) {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: `${1000 * 60 * 60 * 24 * 7}`,
  });
  return token;
};
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.models.User || mongoose.model("User", UserSchema);
module.exports = User;
