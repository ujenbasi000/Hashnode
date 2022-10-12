import { useContext, useEffect } from "react";
import {
  FooterContainer,
  BlogHeader,
  UserDetails,
  UserPosts,
  Toast,
} from "../src/components";
import Head from "next/head";
import client from "../src/helpers/config/apollo-client";
import { ctx } from "../src/helpers/context/post.context";
import { getPostsByUser, GET_USER_STATUS } from "../src/helpers/gql/query";

const User = ({ data, user }) => {
  console.log(data);
  const { toast, setToast, setUser } = useContext(ctx);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user]);

  return (
    <section className="min-h-screen flex flex-col">
      {toast.status && (
        <Toast type={toast.type} msg={toast.msg} setToast={setToast} />
      )}
      {data && (
        <Head>
          <title>{data.user.name} — Hashnode</title>
        </Head>
      )}
      <BlogHeader details={data} />
      <UserDetails details={data} />
      <div className="flex flex-col w-full flex-1">
        <UserPosts posts={data.posts} />
        <FooterContainer />
      </div>
    </section>
  );
};

export default User;

export const getServerSideProps = async (ctx) => {
  const { user } = ctx.query;

  const {
    data: { getPostsByUser: data },
  } = await client.query({
    query: getPostsByUser,
    variables: { user },
  });

  let loggedInUser = null;
  const token = ctx.req.cookies.token;

  if (token) {
    const {
      data: { getUser: data },
    } = await client.query({
      query: GET_USER_STATUS,
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    });
    loggedInUser = data.user;
  }
  if (!data.user) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
  return {
    props: {
      data: data,
      user: loggedInUser,
    },
  };
};
