import Image from "next/Image";
import Link from "next/link";
import { useState } from "react";
import Likeoptions from "../mini-components/Likeoptions";
import { getDate } from "../../helpers/miniFunctions";
import parse from "html-react-parser";
import * as Showdown from "showdown";
import showdownHighlight from "showdown-highlight";

const CommentCard = ({ details }) => {
  const [like, setLike] = useState(false);

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
    <div className="rounded-md p-5 border border-borderLightColor dark:border-borderDarkColor text-xl my-6">
      <header className="flex items-center justify-between w-full">
        <div className="flex gap-3 items-center justify-start">
          <div className="w-10 h-10">
            <Image
              src={details?.user?.profile_photo.url}
              alt={details?.user?.username}
              width={40}
              height={40}
              className="rounded-full w-full object-fit"
            />
          </div>
          <div>
            <h1 className="text-base font-semibold text-black dark:text-white cursor-pointer">
              <Link href={`/${details?.user?.username}`}>
                {details?.user?.name}
              </Link>
            </h1>
            <h1 className="text-sm font-semibold text-paragraphLightColor dark:text-paragraphDarkColor">
              {details?.user?.username}
            </h1>
          </div>
        </div>
        <p className="text-paragraphLightColor dark:text-paragraphDarkColor text-sm font-medium">
          {getDate(details?.createdAt)}
        </p>
      </header>
      <main className="text-base leading-snug py-6 px-14 text-paragraphLightColor dark:text-paragraphDarkColor">
        {parse(converter.makeHtml(details?.comment))}
      </main>

      <footer>
        <div className="relative">
          <button
            className="btn-icon-dark px-4 py-2 border border-borderLightColor dark:border-borderDarkColor"
            onClick={() => setLike((prev) => !prev)}
          >
            <i className="uil uil-smile"></i>{" "}
          </button>
          {like && (
            <div className="absolute top-full left-0 z-10 mt-2">
              <Likeoptions />
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default CommentCard;
