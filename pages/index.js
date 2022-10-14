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
    if (postData) {
      setSearchState(false);
      setPosts(postData);
    }
  }, []);

  useEffect(() => {
    setTags({
      tags: data?.getTrendingTags,
      error,
      loading,
    });
  }, [data, error, loading]);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
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

      <div className="dark:bg-mainBackground bg-grayWhite relative px-0 md:px-6">
        {searchState && (
          <div
            className="absolute top-0 left-0 w-full h-full z-10"
            onClick={() => setSearchState(false)}
          ></div>
        )}

        <div
          className={`w-full xl:container mx-auto posts ${
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
  try {
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
  } catch (err) {
    console.log("error occured: ", err.message);
    return {
      props: {},
    };
  }
}
