const User = require("../../../../server/models/user.model");
const isAuth = require("../auth");

const query = {
  getUser: async (_, __, ctx) => {
    try {
      const user = await isAuth(ctx);

      return {
        success: true,
        user: user,
        error: false,
      };
    } catch (err) {
      return {
        success: false,
        user: null,
        error: err,
      };
    }
  },

  getUserByUsername: async (_, { username }, ctx) => {
    const user = await User.findOne({ username });
    return {
      success: true,
      user: user,
      error: false,
    };
  },
  // searchForUserAvailability: async (parent, args, { models }) => {},
};

module.exports = query;
