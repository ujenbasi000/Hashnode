import NextAuth from "next-auth";
import GoogleProviders from "next-auth/providers/google";
import GithubProviders from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

import clientPromise from "../../../config/mongo";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { Users } from "../../../server/models";

export default NextAuth({
  session: {
    jwt: true,
  },
  adapter: MongoDBAdapter(clientPromise),
  secret: "process.env.SECRET",

  providers: [
    GoogleProviders({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      // profile(profile) {
      //   console.log(profile);
      //   // Not able to use these fields in the database
      //   return {
      //     name: profile.name,
      //     email: profile.email,
      //   };
      // },
    }),
    GithubProviders({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "abc@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "X X X X X X X",
        },
      },

      async authorize(credentials, req) {
        console.log({ credentials });
        const email = credentials.email;
        const password = credentials.password;
        const user = await Users.findOne({ email });

        if (!user) {
          throw new Error("You haven't registered yet");
        }

        if (user) return signinUser({ password, user });
      },
    }),
  ],
  pages: {
    signIn: "/onboard",
  },
  database: process.env.DATABASE_URL,
  callbacks: {
    session: async (session, user) => {
      session.userId = user.sub;
      return Promise.resolve(session);
    },
  },
});

const signinUser = async ({ password, user }) => {
  if (!user.password) {
    throw new Error("Please enter password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Password Incorrect.");
  }
  return user;
};
