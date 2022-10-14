const { gql } = require("apollo-server");

const typeDefs = gql`
  scalar Upload

  type Bio {
    available: String
    about: String
  }

  input BioInput {
    available: String
    about: String
  }

  type Social {
    facebook: String
    twitter: String
    instagram: String
    linkedin: String
    youtube: String
    github: String
    stackoverflow: String
    website: String
  }

  input SocialInput {
    facebook: String
    twitter: String
    instagram: String
    linkedin: String
    youtube: String
    github: String
    stackoverflow: String
    website: String
  }

  type User {
    _id: ID!
    name: String
    email: String
    tagline: [String!]
    bio: Bio
    skills: [String!]
    social: Social
    username: String
    createdAt: String
    followers: [String!]
    following: [String!]
    profile_photo: Image
    cover_image: Image
  }

  type Post {
    _id: ID!
    title: String!
    cover_image: Image
    user: User!
    content: String!
    tags: [String]!
    slug: String!
    likes: Like!
    commentsCount: Int!
    comments: [Comment!]
    createdAt: String!
    subtitle: String
  }

  type Like {
    thumbsup: [String]!
    heart: [String]!
    unicorn: [String]!
    clap: [String]!
    cheers: [String]!
    love: [String]!
    money: [String]!
    trophy: [String]!
    total: Int!
  }

  type Image {
    url: String
    cloud_id: String
  }

  input ImageInput {
    url: String
    cloud_id: String
  }

  input CoverImage {
    url: String
    cloud_id: String
  }

  input CreatePostInput {
    title: String!
    cover_image: CoverImage
    content: String
    tags: [String!]!
    slug: String!
    subtitle: String
  }

  input CreateTagInput {
    name: String!
    logo: ImageInput!
    description: String!
  }

  type Response {
    message: String!
    success: Boolean!
    error: Boolean!
  }

  type Tag {
    _id: ID
    name: String
    followers: [ID]
    articles: Int
    logo: Image
    description: String
  }

  input SlugInput {
    slug: String!
    user: String!
  }

  input LikeInput {
    post: ID!
    like: LikeOption!
  }

  enum LikeOption {
    thumbsup
    heart
    unicorn
    clap
    cheers
    love
    money
    trophy
  }

  type LikeResponse {
    message: String
    success: Boolean
    error: Boolean
    updated: Like
  }

  type PostsByTags {
    posts: [Post!]
    details: Tag
  }

  type PostsByUser {
    user: User
    posts: [Post!]
  }

  input RegisterUserInput {
    email: String!
    password: String!
    name: String!
    username: String!
    profile_photo: ImageInput
  }

  input LoginUserInput {
    email: String!
    password: String!
  }

  type GetUserResponse {
    success: Boolean
    user: User
    error: Boolean
  }

  input UpdateUserInput {
    name: String
    tagline: [String]
    bio: BioInput
    skills: [String]
    social: SocialInput
    profile_photo: ImageInput
    cover_image: ImageInput
    username: String
  }

  input FollowUserInput {
    user: String!
  }

  input FollowTagInput {
    name: String!
  }

  type FollowedTagResponse {
    success: Boolean!
    error: Boolean!
    message: String!
    data: Tag!
  }

  input CommentInput {
    post: ID!
    comment: String!
  }

  type Comment {
    _id: ID!
    user: User!
    comment: String!
    createdAt: String!
    post: ID!
  }

  type CommentResponseData {
    comments: [Comment!]
    commentsCount: Int!
  }

  type CommentResponse {
    message: String!
    success: Boolean!
    error: Boolean!
    data: CommentResponseData!
  }

  type PostBySlugResponse {
    message: String!
    success: Boolean!
    error: Boolean!
    data: Post
  }

  input DeletePostInput {
    _id: ID!
  }

  input LimitInput {
    skip: Int!
    limit: Int!
  }

  input UpdatePostInput {
    _id: ID!
    title: String
    cover_image: ImageInput
    content: String
    tags: [String!]
    subtitle: String
  }

  type DeletePostResponse {
    success: Boolean!
    message: String!
    error: Boolean!
  }

  type Query {
    getUser: GetUserResponse!
    getUserByUsername(username: String!): GetUserResponse!

    getPosts(input: LimitInput!): [Post!]
    getTrendingBlogs(input: LimitInput!): [Post!]
    getPostBySlug(input: SlugInput!): PostBySlugResponse!
    getPostsByTags(tag: String!): PostsByTags!
    getPostsByUser(user: String!): PostsByUser!
    getFollowedPosts: [Post!]

    getSearchedPosts(search: String!): [Post!]

    getTrendingTags: [Tag]
    getNewTags: [Tag]
    getAllTags: [Tag]
    searchTag(tag: String!): Tag
    getManyPosts(ids: [String!]!): [Post]

    searchForUserAvailability(username: String!): Response!
  }

  type Mutation {
    createPost(input: CreatePostInput!): Response!
    updatePost(input: UpdatePostInput!): Response!
    deletePost(input: DeletePostInput!): DeletePostResponse!

    createTag(input: CreateTagInput!): Response!
    followTag(input: FollowTagInput!): FollowedTagResponse!

    likePost(input: LikeInput!): LikeResponse!
    commentOnPost(input: CommentInput!): CommentResponse!

    uploadImage(file: Upload!): Image!

    registerUser(input: RegisterUserInput!): Response!
    loginUser(input: LoginUserInput!): Response!

    updateUser(input: UpdateUserInput): Response!

    # Follow:
    followUser(input: FollowUserInput!): Response!
  }
`;

module.exports = typeDefs;
