import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";

const uploadLink = createUploadLink({
  uri: "http://localhost:5000/graphql",
});

const client = new ApolloClient({
  // ssrMode: true,
  uri: "http://localhost:5000/graphql",
  link: uploadLink,
  cache: new InMemoryCache(),
});

export default client;
