const Tag = require("../../../../server/models/tags.model");

const queries = {
  getTrendingTags: async (_) => {
    const tags = await Tag.find({})
      .sort({ articles: -1, followers: -1 })
      .limit();
    return tags;
  },
  getNewTags: async () => {
    const tags = await Tag.find({}).sort({ createdAt: -1 }).limit(6);
    return tags;
  },
  getAllTags: async () => {
    const tags = await Tag.find({}).limit(18);
    return tags;
  },
  searchTag: async (_, { tag }) => {
    const tags = await Tag.findOne({ name: tag });
    return tags;
  },
};

module.exports = queries;
