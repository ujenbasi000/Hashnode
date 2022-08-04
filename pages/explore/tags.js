import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import connect from "../../server/config/db";
import {
  RightSideBar,
  SideBar,
  ExploreHeader,
  Header,
  SearchList,
  TagsBody,
} from "../../src/components";

import client from "../../src/helpers/config/apollo-client";
import { ctx } from "../../src/helpers/context/post.context";
import {
  getAllTags,
  getNewTags,
  getTrendingTags,
  GET_USER_STATUS,
} from "../../src/helpers/gql/query";

const Tag = ({ trendingTags, newTags, otherTags, user }) => {
  const { setTags, setUser, searchState, setSearchState } = useContext(ctx);

  const [tag, setTag] = useState({
    trendingTags: [],
    newTags: [],
    otherTags: [],
  });

  useEffect(() => {
    setUser(user);
  }, [user]);

  useEffect(() => {
    setSearchState(false);
  }, []);

  useEffect(() => {
    setTag({
      trendingTags,
      newTags,
      otherTags,
    });
    setTags({
      tags: trendingTags.getTrendingTags,
      error: null,
      loading: false,
    });
  }, [trendingTags, newTags]);

  return (
    <>
      <Head>
        <title>🚀 Explore Tags | Hashnode 👋</title>
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
              <TagBody tags={tag} />
              <RightSideBar />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Tag;

const TagBody = ({ tags }) => {
  return (
    <div className="relative z-10 postbody w-full border-x dark:border-borderDarkColor border-borderLightColor dark:bg-primaryBackground mb-20">
      <ExploreHeader />
      <div>
        <TagsBody tags={tags} />
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx) => {
  connect();

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

  const { data: trendingTags } = await client.query({
    query: getTrendingTags,
  });

  const { data: newTags } = await client.query({
    query: getNewTags,
  });

  const { data: otherTags } = await client.query({
    query: getAllTags,
  });

  return {
    props: {
      trendingTags,
      newTags,
      otherTags,
      user,
    },
  };
};
