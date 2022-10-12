import Link from "next/link";
import { reduceText, getDate, readingTime } from "../../helpers/miniFunctions";

const UserArticles = ({ details }) => {
  return (
    <div className="userArticle my-4 py-3 md:flex-row flex-col flex items-center justify-between gap-4 w-full lg:w-7/12 mx-auto border-b border-borderLightColor dark:border-borderDarkColor">
      <div className="w-full">
        <Link
          href={`/${details.user.username.toLowerCase().replaceAll(" ", "")}/${
            details.slug
          }`}
        >
          <h1 className="font-medium text-[1.25rem] cursor-pointer w-11/12 leading-6 text-black dark:text-white">
            {details.title}
          </h1>
        </Link>
        <div className="flex gap-5 justify-start mt-2 items-center">
          <div className="">
            <span className="text-paragraphLightColor dark:text-paragraphDarkColor">
              {getDate(details.createdAt)}
            </span>
          </div>{" "}
          <div className="flex gap-3 items-center">
            <div className="w-4">
              <i className="uil uil-book-open text-paragraphLightColor dark:text-paragraphDarkColor"></i>{" "}
            </div>
            <span className="dark:text-paragraphDarkColor text-paragraphLightColor">
              {readingTime(details.content)} mins read
            </span>
          </div>
        </div>
        <Link
          href={`/${details.user.username.toLowerCase().replaceAll(" ", "")}/${
            details.slug
          }`}
        >
          <div className="text-paragraphLightColor dark:text-paragraphDarkColor text-base my-4 leading-normal cursor-pointer">
            {reduceText(
              details.content,
              details.cover_image && details.cover_image.url ? 200 : 240
            )}
          </div>
        </Link>
      </div>
      {details.cover_image?.url && (
        <div className="md:w-[25rem] w-8/12 md:mb-0 mb-6 cursor-pointer">
          <Link
            href={`/${details.user.username
              .toLowerCase()
              .replaceAll(" ", "")}/${details.slug}`}
          >
            <img src={details.cover_image.url} alt="" className="rounded-md" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserArticles;
