const User = require("../../../../server/models/user.model");
const isAuth = require("../auth");

const mutation = {
  registerUser: async (_, { input }) => {
    try {
      const { username } = input;
      const userExist = await User.findOne({ username });
      if (userExist) {
        console.log({ userExist });
        return {
          success: false,
          message: "Try using another username or email",
          error: true,
        };
      }
      const newUser = {
        ...input,
        profile_photo: {
          url:
            input.profile_photo?.url ||
            "https://res.cloudinary.com/doasgfkcf/image/upload/v1654448800/hashnode/lapzxxciodnrhg3rkeew.webp",
          cloud_id: input.profile_photo?.cloud_id || null,
        },
      };
      const user = await User.create(newUser);
      const token = user.tokenCreation(user._id);

      return {
        success: true,
        message: token,
        error: false,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: true,
      };
    }
  },

  loginUser: async (_, { input }) => {
    const { email, password } = input;
    const user = await User.findOne({ email });

    if (!user) {
      return {
        message: "User not found",
        success: false,
        error: true,
      };
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return {
        message: "Invalid Creditials",
        success: false,
        error: true,
      };
    }

    const token = user.tokenCreation(user._id);

    return {
      success: true,
      message: token,
      error: false,
    };
  },

  updateUser: async (_, { input }, ctx) => {
    try {
      const user = await isAuth(ctx);

      console.log({ input });

      if (user) {
        await User.findOneAndUpdate(
          { _id: user._id },
          {
            ...input,
          }
        );

        return {
          success: true,
          message: "User Updated",
          error: false,
        };
      }
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  },

  followUser: async (_, { input }, ctx) => {
    const user = await isAuth(ctx);

    if (user._id.toString() === input.user) {
      return {
        success: false,
        message: "Unable to follow yourself",
        error: true,
      };
    }

    if (user) {
      const userToFollow = await User.findOne({ _id: input.user });

      if (userToFollow) {
        const followStatus = userToFollow.followers.find(
          (follow) => follow.toString() === user._id.toString()
        );
        if (followStatus) {
          userToFollow.followers = userToFollow.followers.filter(
            (follow) => follow.toString() !== user._id.toString()
          );
          user.following = user.following.filter(
            (follow) => follow.toString() !== input.user
          );
          await userToFollow.save();
          await user.save();
          return {
            success: true,
            message: "User Unfollowed",
            error: false,
          };
        } else {
          userToFollow.followers.push(user._id);
          user.following.push(input.user);
          await userToFollow.save();
          await user.save();
          return {
            success: true,
            message: "User Followed",
            error: false,
          };
        }
      }
    }
  },
};
module.exports = mutation;
