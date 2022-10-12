import Image from "next/image";
import { Twitter, Pin, People } from "../../../public/assets/icons";
import { FOLLOW_TAG_QUERY } from "../../helpers/gql/query";
import { useMutation } from "@apollo/client";
import { getCookie } from "cookies-next";
import { ctx } from "../../helpers/context/post.context";
import { useContext, useState } from "react";
import { useEffect } from "react";

const TagHeader = ({ tagData }) => {
  const token = getCookie("token");
  const [followTagFunction] = useMutation(FOLLOW_TAG_QUERY);
  const [followeState, setFollowState] = useState(null);
  const { user, setToast } = useContext(ctx);
  const [tagDetails, setTagDetails] = useState({
    _id: "",
    name: "",
    description: "",
    followers: [],
    articles: [],
    logo: {
      url: "",
    },
  });

  useEffect(() => {
    setTagDetails(tagData);
  }, [tagData]);

  useEffect(() => {
    if (user) {
      if (tagDetails.followers.includes(user._id)) {
        setFollowState(false);
      } else {
        setFollowState(true);
      }
    }
  }, [tagDetails, user]);

  const followTag = async () => {
    if (user && user?._id) {
      const {
        data: { followTag: data },
      } = await followTagFunction({
        variables: {
          input: {
            name: tagDetails.name,
          },
        },
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      });

      setToast({
        type: "success",
        msg: data.message,
        status: true,
      });

      if (data.message === "Followed") {
        setFollowState(false);
        setTagDetails({
          ...tagDetails,
          followers: data.data.followers,
        });
      } else {
        setFollowState(true);
        setTagDetails({
          ...tagDetails,
          followers: data.data.followers,
        });
      }
    } else {
      setToast({
        msg: "Login to follow tags",
        type: "error",
        status: true,
      });
    }
  };

  return (
    <div className="border-b dark:border-borderDarkColor border-borderLightColor dark:bg-primaryBackground">
      <div className="p-16 flex flex-col items-center justify-center">
        <div className="flex items-center justify-center gap-4">
          {tagDetails?.logo?.url && (
            <Image
              src={tagDetails.logo.url}
              width={50}
              height={50}
              className="rounded-md object-cover"
            />
          )}
          <h1 className="text-2xl text-mainBackground dark:text-grayWhite">
            #{tagDetails.name}
          </h1>
        </div>
        <p className="text-lg my-6 text-paragraphLightColor dark:text-paragraphDarkColor">
          {tagDetails.description}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            className="btn-link border border-blueColor flex items-center gap-1"
            onClick={followTag}
          >
            {followeState === true || followeState === null ? (
              <>
                <i className="text-blueColor text-xl uil uil-plus"></i>
                <span>Follow</span>
              </>
            ) : (
              <>
                <i className="text-blueColor text-xl uil uil-check"></i>
                <span>Following</span>
              </>
            )}
          </button>
        </div>
        <div className="flex gap-4 items-center justify-center mt-6">
          <span className="flex items-center gap-2">
            <i className="text-xl text-black dark:text-white uil uil-users-alt"></i>{" "}
            <span className="text-paragraphLightColor dark:text-paragraphDarkColor">
              {tagDetails.followers.length} Followers
            </span>
          </span>
          <span className="flex items-center gap-2">
            <i className="text-xl text-black dark:text-white uil uil-document-layout-left"></i>{" "}
            <span className="text-paragraphLightColor dark:text-paragraphDarkColor">
              {tagDetails.articles} Articles
            </span>
          </span>
          <span className="flex items-center gap-4">
            <button title="Share in Twitter">
              <i className="text-xl text-black dark:text-white uil uil-twitter-alt"></i>
            </button>
            <button
              onClick={() => {
                setToast({
                  type: "info",
                  msg: "Copied to clipboard",
                  status: true,
                });
                navigator.clipboard.writeText(window.location.href);
              }}
              title="Copy Link"
            >
              <i className="text-xl text-black dark:text-white uil uil-link"></i>
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default TagHeader;
