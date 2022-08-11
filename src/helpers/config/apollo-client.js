import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";

const uploadLink = createUploadLink({
  uri: "http://localhost:5000/graphql",
});

const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",
  link: uploadLink,
  cache: new InMemoryCache(),
  // down code is important for logging in different users in different browser;
  // If this code is deleted then logging in will not work in different browser;
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "network-only",
    },
    query: {
      fetchPolicy: "network-only",
    },
  },
});

export default client;
