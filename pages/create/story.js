import Head from "next/head";
import { useContext, useEffect } from "react";
import { Header, SearchList, Toast, WritingBody } from "../../src/components";
import { ctx } from "../../src/helpers/context/post.context";
import { GET_USER_STATUS } from "../../src/helpers/gql/query";
import connectDB from "../../server/config/db";
import client from "../../src/helpers/config/apollo-client";

const story = ({ user }) => {
  const { toast, setUser, setToast, searchState, setSearchState } =
    useContext(ctx);

  useEffect(() => {
    setUser(user);
  }, [user]);

  useEffect(() => {
    setSearchState(false);
  }, []);

  return (
    <>
      <Head>
        <title>Editing Article</title>
      </Head>
      {toast.status && (
        <Toast type={toast.type} msg={toast.msg} setToast={setToast} />
      )}
      <Header />
      {searchState && (
        <div
          className="absolute top-0 left-0 w-full h-full"
          onClick={() => setSearchState(false)}
        ></div>
      )}
      <div className="bg-grayWhite dark:bg-primaryBackground">
        <div
          onClick={() => setSearchState(false)}
          className={`xl:container mx-auto px-6 lg:px-0  ${
            searchState ? "searchactive" : ""
          }`}
        >
          {searchState ? <SearchList /> : <WritingBody />}
        </div>
      </div>
    </>
  );
};

export default story;

export async function getServerSideProps(ctx) {
  connectDB();

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
      user: user,
    },
  };
}
