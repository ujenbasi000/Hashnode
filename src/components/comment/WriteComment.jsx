import React, { useContext, useState } from "react";
import Image from "next/image";
import { Publish } from "../../../public/assets/icons";
import { ctx } from "../../helpers/context/post.context";
import { PUBLISH_COMMENT } from "../../helpers/gql/mutation";
import { getCookie } from "cookies-next";
import { useMutation } from "@apollo/client";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import showdownHighlight from "showdown-highlight";
import hljs from "highlight.js";
import "react-mde/lib/styles/css/react-mde-all.css";

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

const WriteComment = ({ setWriteComment, post, user, setCommentDetails }) => {
  const [publishComment] = useMutation(PUBLISH_COMMENT);
  const { setToast } = useContext(ctx);

  const publishComent = async () => {
    const details = {
      comment: content,
      post: post._id,
    };

    const token = getCookie("token");

    if (!token) {
      setToast({
        type: "error",
        msg: "You must be logged in to comment.",
        status: true,
      });
      return;
    }
    const {
      data: { commentOnPost: data },
    } = await publishComment({
      variables: {
        input: details,
      },
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    });

    if (data.success) {
      setCommentDetails(data.data);
      setToast({
        type: "success",
        msg: "Comment published successfully.",
        status: true,
      });
      setWriteComment(false);
    } else {
      setToast({
        type: "error",
        msg: "Error publishing comment.",
        status: true,
      });
    }
  };

  const cancelComment = () => {
    setWriteComment(false);
  };
  const [content, setContent] = useState("Start Writing...");
  const [selectedTab, setSelectedTab] = useState("write");

  return (
    <section className="my-10 border border-borderLightColor dark:border-borderDarkColor rounded-md p-4">
      <div className="flex items-center gap-3">
        <Image
          src={user.profile_photo.url}
          alt="user"
          className="rounded-full"
          width={40}
          height={40}
        />
        <h1 className="text-md font-semibold text-black dark:text-white">
          {user.name}
        </h1>
      </div>
      <div className="mt-8">
        <ReactMde
          value={content}
          onChange={setContent}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          generateMarkdownPreview={(markdown) =>
            Promise.resolve(converter.makeHtml(markdown))
          }
        />
      </div>
      <div className="mt-6 flex items-center justify-end">
        <div className="flex gap-6">
          <button className="btn-secondary flex gap-3" onClick={cancelComment}>
            Cancel
          </button>
          <button className="btn-write" onClick={publishComent}>
            <Publish font={20} color="#fff" /> Post
          </button>
        </div>
      </div>
    </section>
  );
};

export default WriteComment;
