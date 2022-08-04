import { useContext, useEffect } from "react";
import { Header, Profile, SideBar, Toast } from "../../../src/components";
import { ctx } from "../../../src/helpers/context/post.context";
import Head from "next/head";
import {
  getTrendingTags,
  getUserByUsername,
  GET_USER_STATUS,
} from "../../../src/helpers/gql/query";
import client from "../../../src/helpers/config/apollo-client";
import { useQuery } from "@apollo/client";
import connect from "../../../server/config/db";

const UserProfile = ({ user, profile_user }) => {
  const { toast, setUser, setSearchState, searchState, setTags } =
    useContext(ctx);
  const { data, error, loading } = useQuery(getTrendingTags);

  useEffect(() => {
    setUser(user);
  }, [user]);

  useEffect(() => {
    setSearchState(false);
  }, []);

  useEffect(() => {
    setTags({
      tags: data?.getTrendingTags,
      error,
      loading,
    });
  }, [data]);

  return (
    <>
      <Head>
        <title>Profile | Hashnode Clone 🟢</title>
      </Head>
      <Header />
      {toast.status && (
        <Toast type={toast.type} msg={toast.msg} setToast={setToast} />
      )}
      <div className="dark:bg-mainBackground bg-grayWhite relative">
        <div
          className="absolute top-0 left-0 w-full h-full"
          onClick={() => setSearchState(false)}
        ></div>
        <div
          onClick={() => setSearchState(false)}
          className={`xl:container mx-auto px-6 xl:px-0 profile ${
            searchState ? "searchactive" : ""
          }`}
        >
          {searchState ? (
            <SearchList />
          ) : (
            <>
              <SideBar />
              <div className="relative z-10 w-full dark:bg-mainBackground mb-20">
                <Profile user={profile_user} loggedInUser={user} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;

export async function getServerSideProps(ctx) {
  connect();

  let user = null,
    profile_user = null;
  const username = ctx.query.username;

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

  const {
    data: { getUserByUsername: data },
  } = await client.query({
    query: getUserByUsername,
    variables: { username },
  });
  profile_user = data.user;

  return {
    props: {
      profile_user: profile_user,
      user,
    },
  };
}
