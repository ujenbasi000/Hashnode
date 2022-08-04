const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    articles: {
      type: Number,
      default: 0,
    },

    description: { type: String },
    logo: {
      url: {
        type: String,
      },
      cloud_id: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

const Tag = mongoose.models.Tag || mongoose.model("Tag", TagSchema);

module.exports = Tag;
