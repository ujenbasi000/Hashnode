const User = require("../../../../server/models/user.model");
const isAuth = require("../auth");

const query = {
  getUser: async (_, __, ctx) => {
    const user = await isAuth(ctx);

    return {
      success: true,
      user: user,
      error: false,
    };
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
