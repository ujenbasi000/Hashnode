const Comment = require("../../../../server/models/comment.model");
const Post = require("../../../../server/models/post.model");
const Tag = require("../../../../server/models/tags.model");
const User = require("../../../../server/models/user.model");
const cloudinary = require("../../../../src/helpers/config/cloudinary.config.js");
const isAuth = require("../auth");

const mutation = {
  createPost: async (_, { input }, ctx) => {
    const user = await isAuth(ctx);

    const { title, content, tags, slug } = input;

    if (!title || !content || !tags || !slug) {
      throw new Error("Please provide all required fields");
    }

    try {
      const post = await Post.create({
        ...input,
        user: user._id,
      });

      if (!post) {
        return {
          message: "Sorry, something went wrong",
          success: false,
          error: true,
        };
      }

      // update article in tag collection
      await Tag.updateMany({ name: { $in: tags } }, { $inc: { articles: 1 } });

      return {
        message: "Post created successfully",
        success: true,
        error: false,
      };
    } catch (err) {
      return {
        message: err.message,
        success: false,
        error: true,
      };
    }
  },

  updatePost: async (_, { input }, ctx) => {
    const user = await isAuth(ctx);
    if (!user) {
      throw new Error("Please login to continue");
    }
    const { _id, ...details } = input;

    await Post.findByIdAndUpdate(_id, {
      ...details,
    });

    return {
      message: "Post updated successfully",
      success: true,
      error: false,
    };
  },

  likePost: async (_, { input }, ctx) => {
    const user = await isAuth(ctx);

    const { post, like } = input;

    const foundPost = await Post.findById(post);

    if (!foundPost) {
      return {
        message: "Post not found",
        success: false,
        error: true,
      };
    }

    const state = foundPost.likes.thumbsup.includes(user._id.toString())
      ? "thumbsup"
      : foundPost.likes.heart.includes(user._id.toString())
      ? "heart"
      : foundPost.likes.unicorn.includes(user._id.toString())
      ? "unicorn"
      : foundPost.likes.clap.includes(user._id.toString())
      ? "clap"
      : foundPost.likes.cheers.includes(user._id.toString())
      ? "cheers"
      : foundPost.likes.love.includes(user._id.toString())
      ? "love"
      : foundPost.likes.money.includes(user._id.toString())
      ? "money"
      : foundPost.likes.trophy.includes(user._id.toString())
      ? "trophy"
      : "none";

    if (state === "none") {
      foundPost.likes[like].push(user._id.toString());
      foundPost.likes.total += 1;
      await foundPost.save();

      return {
        message: "Post liked successfully",
        success: true,
        error: false,
        updated: foundPost.likes,
      };
    } else {
      const decision = foundPost.likes[like].includes(user._id.toString());

      if (decision) {
        foundPost.likes[like].splice(
          foundPost.likes[like].indexOf(user._id.toString()),
          1
        );
        foundPost.likes.total -= 1;
        await foundPost.save();

        return {
          message: "Post unliked successfully",
          success: true,
          error: false,
          updated: foundPost.likes,
        };
      } else {
        foundPost.likes[like].push(user._id.toString());
        foundPost.likes.total += 1;
        await foundPost.save();

        return {
          message: "Post liked successfully",
          success: true,
          error: false,
          updated: foundPost.likes,
        };
      }
    }
  },

  commentOnPost: async (_, { input }, ctx) => {
    const { post, comment } = input;
    const user = await isAuth(ctx);
    if (!user)
      return {
        message: "Please login to comment",
        success: false,
        error: true,
      };

    const postExist = await Post.findById(post)
      .populate({
        path: "comments",
        model: Comment,
      })
      .populate({
        path: "comments",
        populate: { path: "user", model: User },
        model: Comment,
      });

    if (!postExist)
      return {
        message: "Post not found",
        success: false,
        error: true,
      };

    if (!comment) {
      return {
        message: "Please enter a comment",
        success: false,
        error: true,
      };
    }

    let newComment = await Comment.create({
      user: user._id,
      post: post,
      comment: comment,
    });

    newComment = await newComment.populate({ path: "user", model: User });

    postExist.comments.push(newComment);
    postExist.commentsCount = postExist.comments.length;
    await postExist.save();

    if (!newComment) {
      return {
        message: "Something went wrong! Please try again",
        success: false,
        error: true,
      };
    }

    return {
      message: "Comment added successfully",
      success: true,
      error: false,
      data: {
        comments: postExist.comments,
        commentsCount: postExist.commentsCount,
      },
    };
  },

  uploadImage: async (_, { file }) => {
    const {
      file: { createReadStream },
    } = await file;
    const fileStream = createReadStream();

    const response = await new Promise((resolve, reject) => {
      const cloudStream = cloudinary.v2.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "hashnode",
          upload_preset: "hashnode_preset",
        },
        (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        }
      );
      fileStream.pipe(cloudStream);
    });
    return {
      cloud_id: response.public_id,
      url: response.secure_url,
    };
  },

  deletePost: async (_, { input }, ctx) => {
    const user = await isAuth(ctx);
    if (!user) {
      return {
        message: "Not authorized to delete this post",
        success: false,
        error: true,
      };
    }
    const post = await Post.findById(input._id);
    if (!post) {
      return {
        message: "Post not found",
        success: false,
        error: true,
      };
    }
    await Post.findByIdAndDelete(input._id);
    return {
      message: "Post deleted successfully",
      success: true,
      error: false,
    };
  },
};

module.exports = mutation;
