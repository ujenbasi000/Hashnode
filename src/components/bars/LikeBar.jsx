import Image from "next/image";
import { useMutation } from "@apollo/client";
import { useState, useEffect, useContext } from "react";
import { getCookie } from "cookies-next";
import { ctx } from "../../helpers/context/post.context";
import { LIKE_POST } from "../../helpers/gql/query";
import useBookmark from "../../hooks/useBookmark";
import { Confirm } from "../";
import Link from "next/link";
const likes = [
  "Thumbsup",
  "Heart",
  "Unicorn",
  "Clap",
  "Cheers",
  "Love",
  "Money",
  "Trophy",
];

const LikeBar = ({ commentDetails, details: data, like, setLike }) => {
  const [bookmarkState, bookmark, checkBookmark] = useBookmark();
  const [details, setDetails] = useState({});
  const { user, setToast } = useContext(ctx);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  useEffect(() => {
    setDetails(data);
  }, [data]);

  const [likeSubmit] = useMutation(LIKE_POST);

  const likePost = async (like) => {
    setLike(false);
    if (getCookie("token")) {
      const {
        data: { likePost },
      } = await likeSubmit({
        variables: {
          input: {
            post: details._id,
            like: like.toLowerCase(),
          },
        },
        context: {
          headers: {
            authorization: `Bearer ${getCookie("token")}`,
          },
        },
      });

      if (likePost.success) {
        setDetails({ ...details, likes: likePost.updated });
      }
    } else {
      setToast({
        type: "error",
        msg: "You need to login to like this post",
        status: true,
      });
    }
  };

  const handleCopyURL = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setToast({
      type: "success",
      msg: "Copied to clipboard",
      status: true,
    });
  };

  const handleTwitterShare = () => {
    setToast({
      type: "info",
      msg: "Feature Unavailable",
      status: true,
    });
  };

  const openDeleteConfirmation = () => {
    setDeleteConfirmation(true);
  };

  useEffect(() => {
    checkBookmark(details);
  }, [details, bookmarkState]);

  return (
    <div className="w-full lg:w-48 blog_content_sidebar py-20">
      <div className="sticky top-10 right-0">
        {data.user._id === user?._id && (
          <div className="flex flex-col items-center gap-3 mb-6">
            <Link href={`/${user.username}/${data.slug}/edit`}>
              <button className="w-full rounded-md border border-borderLightColor dark:border-borderDarkColor text-lg text-black outline-blue-600 dark:text-white py-2 transistion duration-300 hover:bg-blue-600">
                Edit
              </button>
            </Link>
            <button
              onClick={openDeleteConfirmation}
              className="w-full rounded-md border border-borderLightColor dark:border-borderDarkColor text-lg text-black outline-red-600 dark:text-white py-2 transistion duration-300 hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        )}
        <div className="flex items-center justify-center gap-3 flex-wrap w-full mb-10">
          {details.likes &&
            likes.map((like, index) => {
              return (
                <button
                  onClick={() => likePost(like)}
                  key={index}
                  className={`gap-2 btn-icon-dark px-4 py-2 flex items-center justify-center ${
                    details.likes[like.toLocaleLowerCase()].includes(
                      user?._id
                    ) && "border border-blue-600 dark:border-blue-600"
                  }`}
                >
                  <Image
                    src={require(`../../../public/assets/icons/reactions/${like.toLocaleLowerCase()}.avif`)}
                    width={20}
                    height={20}
                    alt=""
                  />
                  <span className="text-md font-medium text-mainBcakground dark:text-grayWhite">
                    {details?.likes &&
                      details?.likes[like.toLowerCase()].length}
                  </span>
                </button>
              );
            })}
        </div>
        <div className="actions flex-warp flex-row lg:flex-col flex gap-8 items-center justify-center">
          <a href="#comments" className="btn-icon-dark px-4 py-2 relative">
            <i className="uil uil-comment-add text-2xl"></i>
            <span className="bg-grayWhite grid place-content-center absolute bottom-0 right-0 text-md font-semibold w-6 h-6 rounded-full text-mainBackground">
              {commentDetails.commentsCount}
            </span>
          </a>
          <button
            className="btn-icon-dark px-4 py-2"
            onClick={() => bookmark(data)}
          >
            {bookmarkState ? (
              <i className="uis uis-bookmark text-2xl" />
            ) : (
              <i className="uil uil-bookmark text-2xl" />
            )}
          </button>
          <button
            onClick={handleTwitterShare}
            className="btn-icon-dark px-4 py-2"
          >
            <i className="uil uil-twitter-alt text-2xl"></i>
          </button>
          <button className="btn-icon-dark px-4 py-2" onClick={handleCopyURL}>
            <i className="uil uil-copy-alt text-2xl"></i>
          </button>
        </div>
      </div>
      {deleteConfirmation && (
        <Confirm
          title="Confirm to Delete?"
          description="This action cannot be undone. This will permanently delete this post and all comments"
          btn="Delete this post"
          close={() => setDeleteConfirmation(false)}
          func={() => console.log("Hello world")}
        />
      )}
    </div>
  );
};

export default LikeBar;
