import React from "react";
import TagBody from "../tags/TagBody";
import TagHeader from "../headers/TagHeader";

const Tags = ({ posts }) => {
  return (
    <div className="postbody z-10 mb-10 min-h-screen w-full border-x dark:border-borderDarkColor border-borderLightColor dark:bg-primaryBackground">
      <TagHeader tagData={posts.details} />
      <TagBody posts={posts.posts} />
    </div>
  );
};

export default Tags;
