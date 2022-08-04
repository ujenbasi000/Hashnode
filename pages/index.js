import Head from "next/head";
import { useContext, useEffect } from "react";
import {
  SideBar,
  RightSideBar,
  Header,
  Posts,
  SearchList,
  Toast,
} from "../src/components";
import {
  getPosts,
  getTrendingTags,
  GET_USER_STATUS,
} from "../src/helpers/gql/query";
import client from "../src/helpers/config/apollo-client";
import { ctx } from "../src/helpers/context/post.context";
import { useQuery } from "@apollo/client";
import connect from "../server/config/db";

const Home = ({ postData, user }) => {
  const { data, loading, error } = useQuery(getTrendingTags);
  const {
    setUser,
    setTags,
    setPosts,
    searchState,
    setSearchState,
    toast,
    setToast,
  } = useContext(ctx);

  useEffect(() => {
    setSearchState(false);
    setPosts(postData);
  }, []);

  useEffect(() => {
    setTags({
      tags: data?.getTrendingTags,
      error,
      loading,
    });
  }, [data]);

  useEffect(() => {
    setUser(user);
  }, [user]);

  return (
    <>
      <Head>
        <title>🚀 Hashnode | Clone 👋</title>
      </Head>
      <Header />
      {toast.status && (
        <Toast type={toast.type} msg={toast.msg} setToast={setToast} />
      )}
      <div className="dark:bg-mainBackground bg-grayWhite relative px-6">
        {/* <div
          className="absolute top-0 left-0 w-full h-full"
          onClick={() => setSearchState(false)}
        ></div> */}
        {searchState && (
          <div
            className="absolute top-0 left-0 w-full h-full"
            onClick={() => setSearchState(false)}
          ></div>
        )}
        <div
          onClick={() => setSearchState(false)}
          className={`xl:container mx-auto px-6 lg:px-0 posts ${
            searchState ? "searchactive" : ""
          }`}
        >
          {searchState ? (
            <SearchList />
          ) : (
            <>
              <SideBar />
              <Posts />
              <RightSideBar />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;

export async function getServerSideProps(ctx) {
  connect();
  const { data: postData } = await client.query({
    query: getPosts,
    variables: { input: { limit: 10, skip: 0 } },
  });

  let user = null;
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
    user = data.user;
  }

  return {
    props: {
      postData: postData.getPosts,
      user: user,
    },
  };
}
