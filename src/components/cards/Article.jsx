import Link from "next/link";
import { useEffect } from "react";
import { reduceText, readingTime, getDate } from "../../helpers/miniFunctions";
import Image from "next/image";
import useBookmark from "../../hooks/useBookmark";
import * as Showdown from "showdown";
import showdownHighlight from "showdown-highlight";

const Article = ({ details }) => {
  const [bookmarkState, bookmark, checkBookmark] = useBookmark();

  const tagRender = (tags) => {
    if (tags.length > 2) {
      return [tags[0], tags[1]];
    } else {
      return tags;
    }
  };

  useEffect(() => {
    checkBookmark(details);
  }, [details, bookmarkState]);

  const getRemaining = (tags) => {
    const newTags = [...tags];
    const removedEle = newTags.splice(0, 2);
    const remaining = newTags.filter((e) => removedEle.includes(e) === false);

    const title = remaining.map((tag) => tag);

    if (remaining.length > 0) {
      return (
        <div className="relative">
          <span
            className="dark:text-grayWhite text-primaryBackground"
            title={title}
          >
            +{remaining.length}
          </span>
        </div>
      );
    }
  };

  const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
    extensions: [
      showdownHighlight({
        pre: true,
      }),
    ],
  });

  return (
    <div className="relative z-20 p-4 dark:bg-primaryBackground border-b border-borderLightColor dark:border-borderDarkColor hover:dark:bg-cardHover hover:bg-[#a3a3a30f] transition duration-150">
      <header className="flex items-center gap-2">
        <div className="w-12 h-12 rounded-full cursor-pointer">
          <Link href={`/${details.user.username}`}>
            <Image
              className="rounded-full"
              src={details.user.profile_photo.url}
              width={40}
              height={40}
              draggable={false}
              alt={details.user.username}
            />
          </Link>
        </div>

        <div>
          <div className="flex gap-1 items-center">
            <Link href={`/${details.user.username}`}>
              <h1 className="font-semibold text-md w-fit cursor-pointer text-gray-800 dark:text-gray-300">
                {details.user.name}&nbsp;·
              </h1>
            </Link>
            <span className="text-paragraphLightColor dark:text-paragraphDarkColor text-sm font-medium">
              {getDate(details.createdAt)}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-4">
              <i className="uil uil-book-open text-gray-800 dark:text-gray-300"></i>{" "}
            </div>
            <span className="dark:text-paragraphDarkColor text-paragraphLightColor text-sm">
              {readingTime(details.content)} mins read
            </span>
          </div>
        </div>
      </header>
      <section className="my-3 md:flex-row flex-col flex items-start justify-between gap-4">
        <div className="w-full">
          <Link
            href={`/${details.user.username
              .toLowerCase()
              .replaceAll(" ", "")}/${details.slug}`}
          >
            <h1 className="font-medium text-[1.25rem] cursor-pointer w-11/12 leading-6 text-gray-800 dark:text-gray-200">
              {details.title}
            </h1>
          </Link>
          <Link
            href={`/${details.user.username
              .toLowerCase()
              .replaceAll(" ", "")}/${details.slug}`}
          >
            <div className="text-paragraphLightColor dark:text-paragraphDarkColor text-base my-4 leading-normal cursor-pointer article_content">
              {reduceText(
                details.content,
                details.cover_image && details.cover_image.url ? 200 : 240,
                converter
              )}
            </div>
          </Link>
        </div>
        {details.cover_image?.url && (
          <div className="md:w-[25rem] w-full sm:w-9/12 md:mb-0 mb-6 cursor-pointer">
            <Link
              href={`/${details.user.username
                .toLowerCase()
                .replaceAll(" ", "")}/${details.slug}`}
            >
              <img
                src={details.cover_image.url}
                alt={details.title}
                className="rounded-md"
                draggable={false}
              />
            </Link>
          </div>
        )}
      </section>
      <footer className="flex justify-between items-center px-2">
        <div className="flex items-center gap-6">
          <button
            className="btn-icon-nonHoverable"
            onClick={() => bookmark(details)}
          >
            <i
              className={`${
                bookmarkState ? "uis uis" : "uil uil"
              }-bookmark text-gray-800 dark:text-gray-300 text-2xl`}
            ></i>
          </button>
          <div className="hidden md:flex items-center gap-3 relative">
            {tagRender([...details.tags]).map((tag) => {
              return (
                <span
                  className={`dark:text-grayWhite text-primaryBackground font-medium text-sm rounded-full ${
                    !tag.startsWith("+") && "dark:bg-grayColor bg-btnHover"
                  } px-3 py-2`}
                  key={tag}
                >
                  {`#${tag}`}
                </span>
              );
            })}
            {getRemaining(details.tags)}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-3">
            <div className="w-4">
              <i className="uil uil-thumbs-up text-paragraphLightColor dark:text-paragraphDarkColor text-2xl"></i>
            </div>
            <span className="text-paragraphLightColor dark:text-paragraphDarkColor">
              {details.likes.total}
            </span>
          </button>
          <button className="flex items-center gap-3">
            <div className="w-4">
              <i className="uil uil-comment-alt text-paragraphLightColor dark:text-paragraphDarkColor text-2xl"></i>
            </div>
            <span className="text-paragraphLightColor dark:text-paragraphDarkColor">
              {details.commentsCount}
            </span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Article;
