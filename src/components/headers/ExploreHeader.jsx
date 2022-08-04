import { useRouter } from "next/router";

const ExploreHeader = () => {
  const route = useRouter();
  return (
    <>
      <div className="text-center py-10 border-b border-borderLightColor dark:border-borderDarkColor">
        <h1 className="text-3xl font-semibold mb-4 text-mainBackground dark:text-grayWhite">
          Explore Tech Blogs & Tags
        </h1>
        <p className="text-md text-paragraphLightColor dark:text-paragraphDarkColor w-10/12 mx-auto">
          Everything that's… Hashnode. Explore the most popular tech blogs from
          the Hashnode community. A constantly updating list of popular tags and
          the best minds in tech.
        </p>
      </div>
      <div className="border-b border-borderLightColor dark:border-borderDarkColor py-2 flex items-center justify-center">
        <ul className="flex items-center justify-center gap-3">
          <li>
            <button
              className={`btn-tab ${
                route.asPath === "/explore" ? "active" : "disabled"
              }`}
              onClick={() => route.push("/explore")}
            >
              Trending
            </button>
          </li>
          <li>
            <button
              className={`btn-tab ${
                route.asPath === "/explore/tags" ? "active" : "disabled"
              }`}
              onClick={() => route.push("/explore/tags")}
            >
              Tags
            </button>
          </li>
          <li>
            <button
              className={`btn-tab ${
                route.asPath === "/explore/blogs_you_follow"
                  ? "active"
                  : "disabled"
              }`}
              onClick={() => route.push("/explore/blogs_you_follow")}
            >
              Blogs you follow
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ExploreHeader;
