import { useContext, useEffect } from "react";
import {
  Header,
  SearchList,
  SettingsAside,
  SettingsEdit,
  SideBar,
  Toast,
} from "../../src/components";
import { ctx } from "../../src/helpers/context/post.context";
import Head from "next/head";
import { GET_USER } from "../../src/helpers/gql/query";
import client from "../../src/helpers/config/apollo-client";

const settings = ({ user }) => {
  console.log(user);
  const { toast, setToast, setUser, setSearchState, searchState } =
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
        <title>Settings | Hashnode Clone 🟢</title>
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
          className={`relative z-20 py-4 min-h-screen xl:container mx-auto px-6 lg:px-0 settings ${
            searchState ? "searchactive" : ""
          }`}
        >
          {searchState ? (
            <SearchList />
          ) : (
            <>
              <SettingsAside />
              <SettingsEdit user={user} setToast={setToast} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default settings;

export async function getServerSideProps(ctx) {
  let user = null;
  if (ctx.req.cookies.token) {
    const {
      data: { getUser: data },
    } = await client.query({
      query: GET_USER,
      context: {
        headers: {
          authorization: `Bearer ${ctx.req.cookies.token}`,
        },
      },
    });
    user = data.user;
  }

  if (!user) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  }

  return {
    props: {
      user: user,
    },
  };
}
