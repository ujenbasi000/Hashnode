import { useState, useEffect, useContext } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  getTrendingTags,
  GET_BOOKMARKS,
  GET_USER_STATUS,
} from "../src/helpers/gql/query";
import Head from "next/head";
import { ctx } from "../src/helpers/context/post.context";
import {
  Article,
  Header,
  RightSideBar,
  SearchList,
  SideBar,
  Toast,
  CardLoading,
} from "../src/components";
import client from "../src/helpers/config/apollo-client";
import connect from "../server/config/db";

const bookmarks = ({ user }) => {
  const [getBookmarks] = useLazyQuery(GET_BOOKMARKS);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setUser, setTags, toast, setToast, searchState, setSearchState } =
    useContext(ctx);
  const { data, loading: tagLoading, error } = useQuery(getTrendingTags);
  console.log(error?.message);

  useEffect(() => {
    if (error && error.message) {
      setToast({
        status: true,
        msg: error.message,
        type: "error",
      });
    }
  }, [error]);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user]);

  useEffect(() => {
    setSearchState(false);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
      if (bookmarks) {
        const { data } = await getBookmarks({
          variables: {
            ids: bookmarks,
          },
        });
        setLoading(false);
        setBookmarks(data.getManyPosts);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    setTags({
      tags: data?.getTrendingTags,
      error,
      loading: tagLoading,
    });
  }, [data]);

  return (
    <>
      <Head>
        <title>🚀 Bookmarks | Hashnode 👋</title>
      </Head>
      <Header />
      {toast.status && (
        <Toast type={toast.type} msg={toast.msg} setToast={setToast} />
      )}

      <div className="dark:bg-mainBackground bg-grayWhite relative px-0 md:px-6">
        {searchState && (
          <div
            className="absolute top-0 left-0 w-full h-full"
            onClick={() => setSearchState(false)}
          ></div>
        )}
        <div
          onClick={() => setSearchState(false)}
          className={`xl:container mx-auto posts ${
            searchState ? "searchactive" : ""
          }`}
        >
          {searchState ? (
            <SearchList />
          ) : (
            <>
              <SideBar />
              <div className="relative z-10 postbody w-full border-x dark:border-borderDarkColor border-borderLightColor dark:bg-primaryBackground mb-20">
                <header className="py-8 px-4 border-b border-borderLightColor dark:border-borderDarkColor text-center">
                  <h1 className="font-semibold mb-4 text-2xl dark:text-grayWhite text-mainBackground">
                    Bookmarks
                  </h1>
                  <p className="text-md text-paragraphLightColor dark:text-paragraphDarkColor">
                    All articles you have bookmarked on Hashnode
                  </p>
                </header>
                <main>
                  {loading ? (
                    <>
                      <CardLoading />
                      <CardLoading />
                      <CardLoading />
                      <CardLoading />
                    </>
                  ) : (
                    bookmarks.map((details) => (
                      <Article key={details._id} details={details} />
                    ))
                  )}
                </main>
              </div>
              <RightSideBar />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default bookmarks;

export async function getServerSideProps(ctx) {
  connect();

  let user = null;
  if (ctx.req.cookies.token) {
    const {
      data: { getUser: data },
    } = await client.query({
      query: GET_USER_STATUS,
      context: {
        headers: {
          authorization: `Bearer ${ctx.req.cookies.token}`,
        },
      },
    });
    user = data.user;
  }

  return {
    props: {
      user: user,
    },
  };
}
