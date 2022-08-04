import { useQuery } from "@apollo/client";
import Head from "next/head";
import { useContext, useEffect } from "react";
import connect from "../../server/config/db";
import {
  Article,
  NothingHere,
  RightSideBar,
  SideBar,
} from "../../src/components";
import { ExploreHeader, Header, SearchList } from "../../src/components";
import client from "../../src/helpers/config/apollo-client";
import { ctx } from "../../src/helpers/context/post.context";
import {
  getFollowedPosts,
  getTrendingTags,
  GET_USER_STATUS,
} from "../../src/helpers/gql/query";

const FollowedBlogs = ({ postData, user }) => {
  const { searchState, setSearchState, setUser, setTags } = useContext(ctx);
  const { data, loading } = useQuery(getTrendingTags);

  useEffect(() => {
    setUser(user);
  }, [user]);

  useEffect(() => {
    setSearchState(false);
  }, []);

  useEffect(() => {
    setTags({
      tags: data?.getTrendingTags,
      error: false,
      loading,
    });
  }, [data]);

  return (
    <>
      <Head>
        <title>🚀 Expolore | Hashnode 👋</title>
      </Head>
      <Header />

      <div className="dark:bg-mainBackground bg-grayWhite relative">
        <div
          className="absolute top-0 left-0 w-full h-full"
          onClick={() => setSearchState(false)}
        ></div>
        <div
          onClick={() => setSearchState(false)}
          className={`xl:container mx-auto px-6 lg:px-0 posts ${
            searchState && "searchactive"
          }`}
        >
          {searchState ? (
            <SearchList />
          ) : (
            <>
              <SideBar />
              <FollowedBlogBody postData={postData} />
              <RightSideBar user={user} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default FollowedBlogs;

const FollowedBlogBody = ({ postData }) => {
  return (
    <div className="relative z-10 postbody w-full border-x dark:border-borderDarkColor border-borderLightColor dark:bg-primaryBackground mb-20">
      <ExploreHeader />
      {postData === null || postData?.length === 0 ? (
        <NothingHere />
      ) : (
        postData?.map((post) => {
          return <Article key={post.id} details={post} />;
        })
      )}
    </div>
  );
};

export async function getServerSideProps(ctx) {
  connect();

  let user = null;

  const token = ctx.req.cookies.token;

  const {
    data: { getFollowedPosts: postData },
  } = await client.query({
    query: getFollowedPosts,
    context: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  });

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
    user = data.user;
  }

  return {
    props: {
      postData: postData || null,
      user: user || null,
    },
  };
}
