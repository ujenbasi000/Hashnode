import { useState, useContext } from "react";
import { ctx } from "../../helpers/context/post.context";
import {
  handleEditPost,
  handleSubmit,
  UploadImage,
} from "../../helpers/miniFunctions";
import { UPLOAD_QUERY, EDIT_POST } from "../../helpers/gql/mutation";
import { useMutation } from "@apollo/client";

const StoryHeader = ({
  fileUploading,
  setFileUploading,
  data,
  setContent,
  setData,
  postBlog,
  content,
  uploadedFile,
  setUploadedFile,
  subtitle,
  setSubtitle,
  saved,
  edit,
  handleOtherFunctions,
}) => {
  const { setToast } = useContext(ctx);
  const [coverState, setCoverState] = useState(false);
  const [uploadImage] = useMutation(UPLOAD_QUERY);
  const [uploading, setUploading] = useState(false);
  const [updatePost] = useMutation(EDIT_POST);

  const clearContent = () => {
    setContent("");
    setData({
      title: "",
      slug: "",
      tags: "",
      subtitle: "",
    });
    setUploadedFile("");
    localStorage.removeItem("post");
  };

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-4 relative">
        {fileUploading ? (
          <p className="text-lg font-medium flex gap-2">
            <i className="uil uil-sync text-black dark:text-white"></i>
            <span className="text-black dark:text-white">Uploading...</span>
          </p>
        ) : (
          <button
            onClick={() => setCoverState((prev) => !prev)}
            className={`hidden sm:block px-6 py-2 text-paragraphLightColor dark:text-paragraphDarkColor bg-gray-200 dark:bg-gray-800 text-xl rounded-md hover:dark:bg-secondaryBackground hover:bg-[#ddd] ${
              coverState && "bg-secondaryBackground"
            }`}
          >
            Set Cover
          </button>
        )}
        <button
          onClick={() => setSubtitle((prev) => !prev)}
          className={`px-6 py-2 text-paragraphLightColor dark:text-paragraphDarkColor bg-gray-200 dark:bg-gray-800 text-xl rounded-md hover:dark:bg-secondaryBackground hover:bg-[#ddd] ${
            subtitle && "bg-secondaryBackground"
          }`}
        >
          Add Subtitle
        </button>
        {!edit && (
          <button className="flex gap-2 items-center">
            {saved ? (
              <>
                <i className="uil uil-save text-lg text-paragraphLightColor dark:text-paragraphDarkColor"></i>
                <span className="text-md font-medium text-gray-800 dark:text-gray-200">
                  Saved
                </span>
              </>
            ) : (
              <>
                <i className="uil uil-save text-lg text-paragraphLightColor dark:text-paragraphDarkColor"></i>
                <span className="text-md font-medium text-gray-800 dark:text-gray-200">
                  Not Saved
                </span>
              </>
            )}
          </button>
        )}
        {coverState && (
          <div className="bg-white absolute mt-6 top-full dark:bg-mainBackground left-0 w-max rounded-md border border-borderLightColor dark:border-borderDarkColor px-10 py-8">
            <input
              type="file"
              id="coverImage"
              onChange={(e) => {
                UploadImage(
                  e,
                  uploadImage,
                  setFileUploading,
                  setCoverState,
                  setUploadedFile,
                  handleOtherFunctions
                );
                setCoverState(false);
              }}
              hidden
            />
            <label htmlFor="coverImage" className="btn-write mx-auto mb-4">
              Choose an image
            </label>
            <p className="text-lg font-medium text-paragraphDarkColor dark:paragraphLightColor">
              Recommended dimension is 1600 x 840
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-end gap-4">
        <button onClick={clearContent} className="btn-secondary cursor-pointer">
          Cancel
        </button>
        {edit ? (
          <button
            className="btn-write disabled:opacity-90 disabled:cursor-not-allowed"
            disabled={uploading}
            onClick={() => {
              edit
                ? handleEditPost(
                    data,
                    content,
                    setContent,
                    setData,
                    setToast,
                    setUploading,
                    updatePost,
                    uploadedFile,
                    setUploadedFile,
                    handleOtherFunctions
                  )
                : handleSubmit(
                    data,
                    content,
                    setContent,
                    setData,
                    setToast,
                    setUploading,
                    postBlog,
                    uploadedFile,
                    setUploadedFile,
                    handleOtherFunctions
                  );
            }}
          >
            {uploading ? "Updating..." : "Update"}
          </button>
        ) : (
          <button
            className="btn-write disabled:opacity-90 disabled:cursor-not-allowed"
            disabled={uploading}
            onClick={() =>
              handleSubmit(
                data,
                postBlog,
                content,
                setContent,
                setToast,
                setData,
                uploadedFile,
                setUploadedFile,
                setUploading
              )
            }
          >
            {uploading ? "Publishing..." : "Publish"}
          </button>
        )}
      </div>
    </header>
  );
};

export default StoryHeader;
