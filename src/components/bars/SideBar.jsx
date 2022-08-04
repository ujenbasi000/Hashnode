import Link from "next/link";
import { ctx } from "../../helpers/context/post.context";
import { useContext } from "react";
import TagsLoading from "../loadings/tags.loading";
import { useRouter } from "next/router";

const SideBar = () => {
  const { isOpen, toggle, tags } = useContext(ctx);
  const router = useRouter();
  const { pathname } = router;
  const sideMenu = [
    {
      id: "1",
      title: "My Feed",
      icon: (
        <i
          className={`uil uil-newspaper text-xl text-${
            pathname === "/" ? "blueColor" : "gray-700 dark:text-gray-200"
          } `}
        ></i>
      ),
      link: "/",
    },
    {
      id: "2",
      title: "Explore",
      icon: (
        <i
          className={`uil uil-compass text-xl text-${
            pathname === "/explore"
              ? "blueColor"
              : "gray-700 dark:text-gray-200"
          } `}
        ></i>
      ),
      link: "/explore",
    },
    {
      id: "3",
      title: "Drafts",
      icon: (
        <i
          className={`uil uil-edit text-xl text-${
            pathname === "/drafts" ? "blueColor" : "gray-700 dark:text-gray-200"
          } `}
        ></i>
      ),
      link: "/drafts",
    },
    {
      id: "4",
      title: "Bookmark",
      icon: (
        <i
          className={`uil uil-book-alt text-xl text-${
            pathname === "/bookmarks"
              ? "blueColor"
              : "gray-700 dark:text-gray-200"
          }`}
        ></i>
      ),
      link: "/bookmarks",
    },
  ];

  return (
    <>
      <div
        onClick={toggle}
        className={`bg-mainBackground z-20 bg-opacity-40 fixed top-0 left-0 w-screen h-screen md:hidden ${
          !isOpen && "hidden"
        }`}
      ></div>
      <aside
        className={`bg-secondaryBackground border-r border-borderDarkColor lg:bg-transparent lg:border-none px-3 lg:px-0 transition duration-200 h-screen flex items-between justify-between flex-col ${
          isOpen
            ? "lg:sticky translate-x-0 absolute top-0 left-0 z-30"
            : "lg:sticky lg:translate-x-0 -translate-x-full absolute top-0 left-0 z-30"
        } pb-5`}
      >
        <div className="h-[calc(100vh-150px)] flex flex-col">
          <ul className="list-none border-b dark:border-borderDarkColor border-borderLightColor pt-2 pb-6">
            {sideMenu.map((item) => (
              <li key={item.id} className="my-1">
                <Link href={item.link}>
                  <div className="flex items-center justify-start gap-2 text-md font-normal text-borderDarkColor dark:text-grayWhite py-2 hover:bg-btnHover hover:dark:bg-secondaryBackground px-2 rounded-md cursor-pointer transition duration-100">
                    {item.icon}
                    <span
                      className={`${
                        pathname === item.link ? "text-blueColor" : ""
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <ul className="list-none border-b dark:border-borderDarkColor border-borderLightColor py-3">
            <h1 className="text-bold dark:text-[#ccc] text-primaryBackground lg:text-md text-sm mb-2 ">
              Trending Tags
            </h1>
            <div className="w-full">
              {tags.loading ? (
                <>
                  <TagsLoading />
                  <TagsLoading />
                  <TagsLoading />
                  <TagsLoading />
                </>
              ) : (
                tags.tags?.map((item) => {
                  return (
                    <li key={item.name} title={item.name}>
                      <Link href={`/tags/${item.name}`}>
                        <div className="flex-wrap text-sm text-borderDarkColor dark:text-grayWhite font-normal flex items-center justify-between gap-2 p-2 my-1 hover:bg-btnHover hover:dark:bg-secondaryBackground rounded-md cursor-pointer transition duration-100">
                          <span>#{item.name}</span>
                        </div>
                      </Link>
                    </li>
                  );
                })
              )}
            </div>
          </ul>
        </div>
        <footer className="text-center">
          <p className="text-paragraphLightColor dark:text-paragraphDarkColor text-sm mb-2">
            © {new Date().getFullYear()} HASHNODE
          </p>
          <div className="flex items-center gap-2 justify-center">
            <i className="uil uil-twitter-alt text-white"></i>
            <i className="uil uil-linkedin-alt text-white"></i>
            <i className="uil uil-instagram text-white"></i>
            <i className="uil uil-discord text-white"></i>
          </div>
        </footer>
      </aside>
    </>
  );
};

export default SideBar;
