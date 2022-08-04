import Head from "next/head";
import { useEffect, useContext, useState } from "react";
import {
  FooterContainer,
  CommentContainer,
  SinglePageHead,
  BlogContent,
  Toast,
  BlogHeader,
} from "../../../src/components";
import { useRouter } from "next/router";

import {
  getSinglePostBySlug,
  GET_USER_STATUS,
} from "../../../src/helpers/gql/query";
import client from "../../../src/helpers/config/apollo-client";
import { ctx } from "../../../src/helpers/context/post.context";

const Singleblog = ({ data, user }) => {
  // console.log(data);
  const { toast, setToast, setUser } = useContext(ctx);
  const [commentDetails, setCommentDetails] = useState({
    comments: data?.comments,
    commentsCount: data?.commentsCount,
  });

  useEffect(() => {
    setUser(user);
  }, [user]);

  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {data.title && (
        <Head>
          <title>{data.title} — Hashnode</title>
        </Head>
      )}
      {toast.status && (
        <Toast type={toast.type} msg={toast.msg} setToast={setToast} />
      )}
      <BlogHeader details={data} />
      <div className="w-full bg-grayWhite dark:bg-primaryBackground min-h-screen">
        <div className="xl:container mx-auto px-4 py-8">
          <SinglePageHead details={data} />
          <BlogContent commentDetails={commentDetails} details={data} />
          <CommentContainer
            post={data}
            commentDetails={commentDetails}
            setCommentDetails={setCommentDetails}
          />
        </div>
        <FooterContainer />
      </div>
    </>
  );
};

export default Singleblog;

export async function getServerSideProps(ctx) {
  const { user, slug } = ctx.query;

  const {
    data: { getPostBySlug: postData },
  } = await client.query({
    query: getSinglePostBySlug,
    variables: {
      input: {
        user,
        slug,
      },
    },
  });

  let logginedInUser = null;
  const token = ctx.req.cookies.token;

  if (postData.data === null) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

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
    logginedInUser = data.user;

    return {
      props: {
        data: postData.data,
        user: logginedInUser,
      },
    };
  } else {
    return {
      props: {
        data: postData.data,
        user: null,
      },
    };
  }
}
