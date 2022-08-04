const { gql } = require("@apollo/client");

const POST_QUERY = gql`
  mutation CREATE_POST($input: CreatePostInput!) {
    createPost(input: $input) {
      message
      success
      error
    }
  }
`;

const UPLOAD_QUERY = gql`
  mutation UPLOAD_IMAGE($file: Upload!) {
    uploadImage(file: $file) {
      cloud_id
      url
    }
  }
`;

const CREATE_TAG_QUERY = gql`
  mutation CREATE_TAG($input: CreateTagInput!) {
    createTag(input: $input) {
      error
      success
      message
    }
  }
`;
const CREATE_USER = gql`
  mutation CREATE_USER($input: RegisterUserInput!) {
    registerUser(input: $input) {
      message
      success
      error
    }
  }
`;
const LOGIN_USER = gql`
  mutation LOGIN_USER($input: LoginUserInput!) {
    loginUser(input: $input) {
      error
      success
      message
    }
  }
`;
const FOLLOW_USER = gql`
  mutation FOLLOW_USER($input: FollowUserInput!) {
    followUser(input: $input) {
      error
      message
      success
    }
  }
`;

const PUBLISH_COMMENT = gql`
  mutation COMMENT($input: CommentInput!) {
    commentOnPost(input: $input) {
      error
      message
      success
      data {
        commentsCount
        comments {
          _id
          comment
          createdAt
          user {
            username
            name
            profile_photo {
              url
            }
          }
        }
      }
    }
  }
`;

export {
  POST_QUERY,
  UPLOAD_QUERY,
  CREATE_TAG_QUERY,
  CREATE_USER,
  LOGIN_USER,
  FOLLOW_USER,
  PUBLISH_COMMENT,
};
