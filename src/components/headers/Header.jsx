import Link from "next/link";
import Image from "next/image";
import User from "../../../public/assets/demo_user.webp";
import { useLazyQuery } from "@apollo/client";
import { useState, useContext, useCallback } from "react";
import { ctx } from "../../helpers/context/post.context";
import { debounce } from "lodash";
import { GET_SEARCHED_POST } from "../../helpers/gql/query";
import { removeCookies } from "cookies-next";

const Header = () => {
  const {
    toggle,
    user,
    setSearchLoading,
    setSearchedPosts,
    setSearchState,
    inputRef,
    overlay,
    setOverlay,
    openMenu,
    setOpenMenu,
    setTheme,
    setIsOpen,
  } = useContext(ctx);
  const [getData] = useLazyQuery(GET_SEARCHED_POST);
  const handler = useCallback(debounce(someFunction, 300), []);

  async function someFunction(value) {
    if (value === "") setSearchState(false);
    if (value.trim().length > 0) {
      setSearchLoading(true);
      const {
        data: { getSearchedPosts },
      } = await getData({
        variables: {
          search: value,
        },
      });

      setSearchLoading(false);
      setSearchedPosts(getSearchedPosts);
    }
  }

  return (
    <header className="z-30 relative w-full bg-white dark:bg-primaryBackground border-b border-borderLightColor dark:border-borderDarkColor px-4 m-0 lg:m-auto">
      <div className="xl:container mx-auto py-4 flex gap-6 items-center justify-between">
        <div className="flex items-center justify-center gap-4">
          <button
            className="w-6 block lg:hidden"
            onClick={() => {
              setOverlay((prev) => !prev);
              toggle();
            }}
          >
            <i className="uil uil-bars text-black dark:text-white text-xl"></i>
          </button>
          <Link href={"/"}>
            <div className="block w-40 cursor-pointer fill-black dark:fill-white">
              <svg style={{ width: "140px" }} viewBox="0 0 688 118">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.95 38.655c-10.6 10.6-10.6 27.784 0 38.383l30.705 30.706c10.6 10.599 27.784 10.599 38.383 0l30.706-30.706c10.599-10.6 10.599-27.784 0-38.383L77.038 7.95c-10.6-10.599-27.784-10.599-38.383 0L7.95 38.655zm63.33 32.626c7.42-7.42 7.42-19.449 0-26.868-7.419-7.42-19.448-7.42-26.867 0-7.42 7.42-7.42 19.448 0 26.868 7.42 7.419 19.448 7.419 26.868 0z"
                  fill="#2962FF"
                ></path>
                <path d="M161.437 78.362c.043-8.549 5.268-13.558 12.781-13.558 7.47 0 11.874 4.793 11.831 12.954v38.947h18.394V74.476c.043-15.544-9.111-24.957-22.928-24.957-10.06 0-16.796 4.75-19.819 12.565h-.777V28.276h-17.876v88.429h18.394V78.362zM232.967 117.957c9.801 0 16.148-4.275 19.387-10.449h.518v9.197h17.444V71.972c0-15.803-13.385-22.453-28.152-22.453-15.89 0-26.339 7.6-28.887 19.69l17.013 1.381c1.252-4.404 5.181-7.642 11.787-7.642 6.261 0 9.845 3.152 9.845 8.592v.26c0 4.274-4.534 4.835-16.062 5.958-13.127 1.209-24.914 5.613-24.914 20.423 0 13.126 9.369 19.776 22.021 19.776zm5.267-12.695c-5.656 0-9.715-2.633-9.715-7.685 0-5.182 4.275-7.73 10.752-8.636 4.015-.561 10.578-1.511 12.78-2.98V93c0 6.951-5.742 12.262-13.817 12.262zM334.904 69.295c-1.64-12.22-11.485-19.776-28.238-19.776-16.969 0-28.152 7.859-28.109 20.64-.043 9.93 6.218 16.364 19.171 18.955l11.485 2.288c5.786 1.166 8.42 3.282 8.506 6.606-.086 3.93-4.361 6.736-10.794 6.736-6.563 0-10.924-2.806-12.047-8.204l-18.091.95c1.727 12.695 12.521 20.51 30.095 20.51 17.185 0 29.49-8.765 29.534-21.848-.044-9.586-6.304-15.329-19.171-17.962l-12.004-2.418c-6.175-1.339-8.463-3.455-8.42-6.65-.043-3.972 4.448-6.563 10.147-6.563 6.39 0 10.19 3.498 11.097 7.772l16.839-1.036zM361.529 78.362c.043-8.549 5.267-13.558 12.78-13.558 7.47 0 11.874 4.793 11.831 12.954v38.947h18.394V74.476c.043-15.544-9.111-24.957-22.928-24.957-10.06 0-16.796 4.75-19.818 12.565h-.778V28.276h-17.875v88.429h18.394V78.362zM432.54 78.362c.043-8.549 5.138-13.558 12.565-13.558 7.383 0 11.831 4.836 11.787 12.954v38.947h18.394V74.476c0-15.457-9.067-24.957-22.884-24.957-9.845 0-16.969 4.836-19.948 12.565h-.778V50.383h-17.53v66.322h18.394V78.362zM514.885 118c20.122 0 32.643-13.774 32.643-34.197 0-20.553-12.521-34.284-32.643-34.284-20.121 0-32.642 13.731-32.642 34.284 0 20.423 12.521 34.197 32.642 34.197zm.087-14.249c-9.283 0-14.033-8.506-14.033-20.078s4.75-20.12 14.033-20.12c9.11 0 13.86 8.549 13.86 20.12 0 11.572-4.75 20.078-13.86 20.078zM579.064 117.784c10.708 0 16.278-6.174 18.826-11.701h.777v10.622h18.135v-88.43h-18.351v33.248h-.561c-2.462-5.397-7.773-12.004-18.869-12.004-14.551 0-26.857 11.313-26.857 34.111 0 22.194 11.788 34.154 26.9 34.154zm5.829-14.637c-9.024 0-13.947-8.032-13.947-19.603 0-11.486 4.836-19.387 13.947-19.387 8.938 0 13.947 7.556 13.947 19.387 0 11.83-5.096 19.603-13.947 19.603zM657.286 118c16.408 0 27.461-7.988 30.052-20.294l-17.012-1.122c-1.857 5.051-6.606 7.685-12.738 7.685-9.197 0-15.026-6.088-15.026-15.976v-.043h45.165v-5.052c0-22.539-13.645-33.679-31.175-33.679-19.517 0-32.168 13.86-32.168 34.327 0 21.028 12.479 34.154 32.902 34.154zm-14.724-41.149c.389-7.556 6.132-13.601 14.292-13.601 7.988 0 13.515 5.7 13.558 13.601h-27.85z"></path>
              </svg>
            </div>
          </Link>
        </div>

        <div className="w-full hidden md:block">
          <div className="flex gap-4 items-center justify-end">
            <form
              className="relative w-full hidden lg:block"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="absolute top-1/2 left-4 -translate-y-1/2 -mt-[2px] w-4 h-4">
                <i className="uil uil-search text-paragraphLightColor dark:text-paragraphDarkColor"></i>{" "}
              </div>
              <input
                type="text"
                autoComplete="off"
                name="search"
                ref={inputRef}
                onChange={(e) => {
                  handler(e.target.value);
                  setSearchState(true);
                }}
                placeholder="Search for tags, people, article, and many more"
                className="w-full rounded-full bg-grayWhite border dark:border-gray-700 border-gray-200 px-10 outline-blueColor py-2 outline-1 dark:bg-mainBackground dark:outline-none text-gray-800 dark:text-gray-200"
              />
              <div className="absolute top-1/2 right-4 -translate-y-1/2">
                <span className="p-[0.375rem] text-[0.675rem] rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white">
                  /
                </span>
              </div>
            </form>

            {user?._id && (
              <Link href="/create/story">
                <button className="btn-write flex items-center justify-center gap-3">
                  <span>
                    <i className="uil uil-pen "></i>{" "}
                  </span>
                  <span>Write</span>
                </button>
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/chats">
            <button className="px-2 py-1 rounded-full hover:bg-gray-200 hover:dark:bg-gray-700 hidden sm:block">
              <i className="uil uil-facebook-messenger text-2xl text-gray-600 dark:text-gray-200" />
            </button>
          </Link>
          <button className="rounded-full hover:bg-gray-200 hover:dark:bg-gray-700">
            <div
              onClick={() =>
                setTheme((theme) => (theme === "dark" ? "light" : "dark"))
              }
              className="w-10 h-10 grid place-content-center"
            >
              <i className="uil uil-moon dark:uil-sun text-2xl text-gray-600 dark:text-gray-200"></i>
            </div>
          </button>
          <button className="rounded-full hover:bg-gray-200 hover:dark:bg-gray-700 hidden sm:block">
            <div className="w-10 h-10 grid place-content-center">
              <i className="uil uil-bell text-2xl text-gray-600 dark:text-gray-200"></i>
            </div>
          </button>
          <div className="relative">
            <button
              className="flex items-center justify-center ml-3 w-[40px]"
              onClick={() => setOpenMenu((prev) => !prev)}
            >
              <Image
                className="rounded-full object-cover"
                src={
                  user
                    ? user?.profile_photo?.url
                      ? user.profile_photo.url
                      : User
                    : User
                }
                width={70}
                height={70}
                alt="User"
              />
            </button>
            {openMenu && <HeaderMenu user={user} setOpenMenu={setOpenMenu} />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

export const HeaderMenu = ({ user, setOpenMenu }) => {
  const logout = () => {
    removeCookies("token");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return user?._id ? (
    <div className="shadow-md dark:shadow-mainBackground w-72 absolute top-full mt-4 right-0 z-50 rounded-md bg-grayWhite dark:bg-secondaryBackground border border-borderLightColor dark:border-borderDarkColor">
      <Link href={`/profile/${user.username}`}>
        <div
          onClick={() => setOpenMenu(false)}
          className="py-5 flex items-center gap-2 border-b border-borderLightColor dark:border-borderDarkColor px-4 hover:bg-borderLightColor hover:dark:bg-borderDarkColor cursor-pointer"
        >
          <Image
            src={user.profile_photo?.url}
            className="w-16 h-16 rounded-full object-cover"
            alt=""
            width={50}
            height={50}
          />
          <div>
            <h1 className="text-md font-semibold text-mainBackground dark:text-gray-200">
              {user.name}
            </h1>
            <h1 className="text-md font-medium text-paragraphLightColor dark:text-paragraphDarkColor">
              @{user.username}
            </h1>
          </div>
        </div>
      </Link>

      <ul className="mt-2">
        <li>
          <Link href="/drafts">
            <button
              onClick={() => setOpenMenu(false)}
              className="py-2 flex items-center gap-2 hover:bg-borderLightColor hover:dark:bg-borderDarkColor w-full px-4 text-paragraphLightColor dark:text-paragraphDarkColor"
            >
              <i className="uil uil-file text-xl"></i>
              <span>My Drafts</span>
            </button>
          </Link>
        </li>
        <li>
          <Link href="/bookmarks">
            <button
              onClick={() => setOpenMenu(false)}
              className="py-2 flex items-center gap-2 hover:bg-borderLightColor hover:dark:bg-borderDarkColor w-full px-4 text-paragraphLightColor dark:text-paragraphDarkColor"
            >
              <i className="text-xl uil uil-bookmark"></i>
              <span>My Bookmarks</span>
            </button>
          </Link>
        </li>
        <li>
          <Link href="/settings">
            <button
              onClick={() => setOpenMenu(false)}
              className="py-2 flex items-center gap-2 hover:bg-borderLightColor hover:dark:bg-borderDarkColor w-full px-4 text-paragraphLightColor dark:text-paragraphDarkColor"
            >
              <i className="text-xl uil uil-setting"></i>
              <span>Account Settings</span>
            </button>
          </Link>
        </li>
        <li>
          <Link href="/manage">
            <button
              onClick={() => setOpenMenu(false)}
              className="py-2 flex items-center gap-2 hover:bg-borderLightColor hover:dark:bg-borderDarkColor w-full px-4 text-paragraphLightColor dark:text-paragraphDarkColor"
            >
              <i className="text-xl uil uil-wallet"></i>
              <span>Manage your blogs</span>
            </button>
          </Link>
        </li>
      </ul>
      <button
        onClick={logout}
        className="text-paragraphLightColor dark:text-paragraphDarkColor flex gap-2 items-center border-t border-borderLightColor dark:border-borderDarkColor w-full text-left px-4 py-3 hover:bg-borderDarkColor"
      >
        <i className="text-xl uil uil-signout"></i>
        <span>Log out</span>
      </button>
    </div>
  ) : (
    <div className="shadow-md dark:shadow-mainBackground w-72 absolute py-4 top-full mt-4 right-0 z-50 rounded-md bg-grayWhite dark:bg-secondaryBackground border border-borderLightColor dark:border-borderDarkColor">
      <div className="flex items-center gap-4 justify-center text-paragraphLightColor dark:text-paragraphDarkColor">
        <Link href="/onboard?s=login">
          <button
            onClick={() => setOpenMenu(false)}
            className="px-4 py-2 border border-blueColor text-blueColor rounded-md text-md"
          >
            Login
          </button>
        </Link>
        <Link href="/onboard">
          <button
            onClick={() => setOpenMenu(false)}
            className="px-4 py-2 border border-blueColor text-blueColor rounded-md text-md"
          >
            Register
          </button>
        </Link>
      </div>
    </div>
  );
};
