import { useContext, useEffect, useState } from "react";
import { ctx } from "../../helpers/context/post.context";
import CommentCard from "./CommentCard";
import WriteComment from "./WriteComment";

const CommentContainer = ({ post, commentDetails, setCommentDetails }) => {
  const { user, setToast } = useContext(ctx);
  const [writeComment, setWriteComment] = useState(false);

  return (
    <div id="comments" className="w-11/12 lg:w-9/12 xl:w-6/12 mx-auto py-10">
      <header className="flex justify-between items-center w-full rounded-md border border-borderLightColor dark:border-borderDarkColor px-3 py-4 mb-10">
        <h1 className="font-bold text-priamryBackground dark:text-grayWhite text-xl">
          Comments ({commentDetails.commentsCount})
        </h1>
        <button
          className="btn-write flex items-center gap-3"
          onClick={() => {
            if (user) {
              setWriteComment((prev) => !prev);
            } else {
              setToast({
                status: true,
                msg: "You are not allowed to comment",
                type: "error",
              });
            }
          }}
        >
          <i className="uil uil-plus"></i> <span>Write a Comment</span>
        </button>
      </header>

      {writeComment && (
        <WriteComment
          setWriteComment={setWriteComment}
          post={post}
          user={user}
          setCommentDetails={setCommentDetails}
        />
      )}

      <main className="mb-10">
        {commentDetails.comments?.map((comment) => (
          <CommentCard key={comment._id} details={comment} />
        ))}
      </main>
    </div>
  );
};

export default CommentContainer;
