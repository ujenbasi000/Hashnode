import Head from "next/head";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { Header, SearchList, SettingsAside, Toast } from "../../src/components";
import client from "../../src/helpers/config/apollo-client";
import { ctx } from "../../src/helpers/context/post.context";
import { GET_USER } from "../../src/helpers/gql/query";

const account = ({ user }) => {
  const { toast, setToast, setUser, setSearchState, searchState } =
    useContext(ctx);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

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
          className={`relative z-40 py-4 min-h-screen container mx-auto lg:px-4 settings ${
            searchState && "searchactive"
          }`}
        >
          {searchState ? (
            <SearchList />
          ) : (
            <>
              <SettingsAside />
              <main className="p-6 rounded-md border border-borderLightColor dark:border-borderDarkColor bg-btnBackground">
                <h1 className="text-2xl font-bold mb-6 text-black dark:text-white">
                  Danger Zone
                </h1>
                <p className="text-paragraphLightColor dark:text-paragraphDarkColor text-md mb-3">
                  You can delete your account here.
                </p>
                <button
                  className="bg-red-500 hover:bg-red-700 rounded-md text-white border border-red-500 px-6 py-2"
                  onClick={() => setDeleteConfirmation(true)}
                >
                  Delete
                </button>
              </main>
            </>
          )}
          {deleteConfirmation && (
            <Confim
              title="Confirm to Delete?"
              descripton="This action cannot be undone. This will permanently delete all
              posts, comments, etc."
              btn="I understand this consequences, delete my account"
              close={() => setDeleteConfirmation(false)}
              func={() => console.log("Hello world")}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default account;

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
