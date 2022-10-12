const Post = require("../../../../server/models/post.model");
const Comment = require("../../../../server/models/comment.model");
const User = require("../../../../server/models/user.model");
const Tag = require("../../../../server/models/tags.model");
const isAuth = require("../auth");
const connect = require("../../../../server/config/db");

const exportedFunction = {
  getPosts: async (_, { input }) => {
    connect();
    const posts = await Post.find()
      .populate({ path: "user", model: User })
      .populate({ path: "comments", populate: "user", model: User })
      .skip(input.skip)
      .limit(input.limit)
      .sort({ createdAt: -1 });

    return posts;
  },

  getFollowedPosts: async (_, __, ctx) => {
    connect();

    const user = await isAuth(ctx);
    if (!user) return null;

    const posts = await Post.find({
      user: { $in: user.following },
    }).populate({ path: "user", model: User });

    return posts;
  },

  getTrendingBlogs: async (_, { input }) => {
    connect();

    const { limit = 6, skip = 0 } = input;
    const posts = await Post.find()
      .populate({ path: "user", model: User })
      .sort({
        "likes.total": -1,
        commentsCount: -1,
      })
      .skip(skip)
      .limit(limit);
    return posts;
  },

  getPostBySlug: async (_, { input }) => {
    connect();

    try {
      const { user, slug } = input;
      const post = await Post.findOne({
        $and: [{ slug }, { username: user }],
      })
        .populate({ path: "user", model: User })
        .populate({
          path: "comments",
          populate: { path: "user", model: User },
          model: Comment,
        });

      return {
        data: post,
        message: "Post found",
        success: true,
        error: false,
      };
    } catch (err) {
      return {
        data: null,
        message: "Something went wrong",
        success: false,
        error: true,
      };
    }
  },

  getPostsByTags: async (_, { tag }) => {
    connect();

    const posts = await Post.find({ tags: { $in: tag } }).populate({
      path: "user",
      model: User,
    });
    const tagDetails = await Tag.find({ name: tag });
    return { details: tagDetails[0], posts: posts };
  },

  getSearchedPosts: async (_, { search }) => {
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $match: {
          $or: [
            {
              "user.username": { $regex: search, $options: "i" },
            },
            { title: { $regex: search, $options: "i" } },
            { tags: { $regex: search, $options: "i" } },
          ],
        },
      },
    ]);
    let newPosts = [];
    posts.forEach((post) => {
      newPosts.push({ ...post, user: post.user[0] });
    });
    return newPosts;
  },

  getPostsByUser: async (_, { user }) => {
    connect();

    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $match: {
          "user.username": user,
        },
      },
    ]);
    const userDetails = await User.aggregate([
      {
        $match: {
          username: user,
        },
      },
    ]);
    let newPosts = [];
    posts.forEach((post) => {
      newPosts.push({ ...post, user: post.user[0] });
    });
    return { user: userDetails[0], posts: newPosts };
  },

  getManyPosts: async (_, { ids }) => {
    connect();

    const posts = await Post.find({ _id: { $in: ids } }).populate({
      path: "user",
      model: User,
    });
    return posts;
  },
};

module.exports = exportedFunction;
