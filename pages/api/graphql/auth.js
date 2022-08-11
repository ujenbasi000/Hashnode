const jwt = require("jsonwebtoken");
const connect = require("../../../server/config/db");
const User = require("../../../server/models/user.model");

const isAuth = async ({ req }) => {
  try {
    connect();
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(" ")[1];

      if (token === "undefined") {
        return null;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded) {
        return null;
      }

      const user = await User.findById(decoded.id);

      if (!user) return null;

      return user;
    }
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = isAuth;
