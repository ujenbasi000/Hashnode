import { useLazyQuery } from "@apollo/client";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import { RightSideBar, SideBar } from "../../src/components";
import Header from "../../src/components/headers/Header";
import Explore from "../../src/components/mini-components/Explore";
import SearchList from "../../src/components/mini-components/SearchList";
import client from "../../src/helpers/config/apollo-client";
import { ctx } from "../../src/helpers/context/post.context";
import {
  getAllTags,
  getNewTags,
  getTrendingBlogs,
  getTrendingTags,
  GET_USER_STATUS,
} from "../../src/helpers/gql/query";

const explore = ({ trendingTags, newTags, otherTags, trendingBlogs, user }) => {
  const {
    setTags: setGloabTags,
    searchState,
    setSearchState,
    setUser,
  } = useContext(ctx);

  useEffect(() => {
    setUser(user);
  }, [user]);

  useEffect(() => {
    setSearchState(false);
  }, []);

  const [posts, setPosts] = useState([]);
  const [remainingLoading, setRemainingLoading] = useState(false);
  const [morePosts] = useLazyQuery(getTrendingBlogs);
  const [ended, setEnded] = useState(false);

  const [tags, setTags] = useState({
    trendingTags: [],
    newTags: [],
    otherTags: [],
  });

  useEffect(() => {
    setTags({
      trendingTags,
      newTags,
      otherTags,
    });
    setPosts(trendingBlogs.getTrendingBlogs);
    setGloabTags({
      error: null,
      loading: false,
      tags: trendingTags.getTrendingTags,
    });
  }, [trendingTags, newTags, trendingBlogs]);

  const getMorePosts = async () => {
    let limit = 4;
    setRemainingLoading(true);
    const {
      data: { getTrendingBlogs: data },
    } = await morePosts({
      variables: {
        input: {
          skip: posts.length,
          limit: 6,
        },
      },
    });
    if (data.length < limit) {
      setEnded(true);
    }
    if (data.length > 0) {
      setPosts([...posts, ...data]);
    }
    setRemainingLoading(false);
  };

  return (
    <>
      <Head>
        <title>🚀 Explore | Hashnode 👋</title>
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
              <Explore
                tags={tags}
                posts={posts}
                getMorePosts={getMorePosts}
                remainingLoading={remainingLoading}
                ended={ended}
              />
              <RightSideBar />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default explore;

export const getServerSideProps = async (ctx) => {
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
  const { data: tagData } = await client.query({
    query: getTrendingTags,
  });

  const { data: newTags } = await client.query({
    query: getNewTags,
  });

  const { data: otherTags } = await client.query({
    query: getAllTags,
  });

  const { data: trendingBlogs } = await client.query({
    query: getTrendingBlogs,
    variables: {
      input: {
        limit: 2,
        skip: 0,
      },
    },
  });

  return {
    props: {
      trendingTags: tagData,
      newTags,
      otherTags: otherTags,
      trendingBlogs,
      user,
    },
  };
};
