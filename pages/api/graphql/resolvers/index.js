const UserQuery = require("./user.query");
const PostQuery = require("./posts.query");
const TagQuery = require("./tags.query");

const UserMutation = require("./user.mutation");
const PostMutation = require("./posts.mutation");
const TagMutation = require("./tags.mutation");

const res = {
  Query: {
    ...UserQuery,
    ...PostQuery,
    ...TagQuery,
  },

  Mutation: {
    ...UserMutation,
    ...PostMutation,
    ...TagMutation,
  },
};

module.exports = res;
