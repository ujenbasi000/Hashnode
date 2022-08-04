import Article from "../cards/Article";

const TagBody = ({ posts }) => {
  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post, index) => {
          return <Article key={index} details={post} />;
        })
      ) : (
        <div
          style={{ minHeight: "356px" }}
          className="flex flex-col items-center justify-center"
        >
          <h1 className="text-xl text-black dark:text-white">
            😔 No articles has been posted in this Tag
          </h1>
        </div>
      )}
    </div>
  );
};

export default TagBody;
