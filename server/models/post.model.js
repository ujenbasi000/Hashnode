const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    cover_image: {
      url: { type: String },
      cloud_id: { type: String },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: { type: String },
    tags: [{ type: String }],
    subtitle: { type: String },
    likes: {
      thumbsup: [{ type: String }],
      heart: [{ type: String }],
      unicorn: [{ type: String }],
      clap: [{ type: String }],
      cheers: [{ type: String }],
      love: [{ type: String }],
      money: [{ type: String }],
      trophy: [{ type: String }],
      total: { type: Number, default: 0 },
    },
    slug: { type: String },
    commentsCount: { type: Number, default: 0 },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);

module.exports = Post;
