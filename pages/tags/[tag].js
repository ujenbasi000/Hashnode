import Head from "next/head";
import client from "../../src/helpers/config/apollo-client";
import {
  getPostsByTag,
  getTrendingTags,
  GET_USER_STATUS,
} from "../../src/helpers/gql/query";
import {
  Header,
  RightSideBar,
  SearchList,
  SideBar,
  Tags,
  Toast,
} from "../../src/components";
import { ctx } from "../../src/helpers/context/post.context";
import { useEffect, useContext } from "react";
import connect from "../../server/config/db";

const TagPage = ({ user, data, tagData }) => {
  const { setUser, setTags, toast, setToast, setSearchState, searchState } =
    useContext(ctx);

  useEffect(() => {
    setTags({
      tags: tagData,
      error: null,
      loading: false,
    });
  }, [tagData]);

  useEffect(() => {
    if (user) {
      console.log(user);
      setUser(user);
    }
  }, [user]);

  return (
    <>
      <Head>
        <title>🚀 Hashnode | Clone 👋</title>
      </Head>
      {toast.status && (
        <Toast type={toast.type} msg={toast.msg} setToast={setToast} />
      )}
      <Header />
      <div className="dark:bg-mainBackground bg-grayWhite relative px-6">
        <div
          className="absolute top-0 left-0 w-full h-full"
          onClick={() => setSearchState(false)}
        ></div>
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
              <Tags posts={data} />
              <RightSideBar />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TagPage;

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

  const { data } = await client.query({
    query: getPostsByTag,
    variables: {
      tag: ctx.query.tag,
    },
  });

  const { data: tagData } = await client.query({
    query: getTrendingTags,
  });

  if (data) {
    if (!data.getPostsByTags.details) {
      console.log("Redirecting");
      return {
        redirect: {
          destination: "/404",
        },
      };
    }
  }

  return {
    props: {
      data: data.getPostsByTags,
      tagData: tagData.getTrendingTags,
      user: user,
    },
  };
};
