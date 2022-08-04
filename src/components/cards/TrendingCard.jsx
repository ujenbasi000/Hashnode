import Image from "next/image";
import Link from "next/link";

const TrendingCard = ({ post }) => {
  return (
    <div className="px-4 py-2">
      <div className="trending_card border-b border-borderLightColor dark:border-borderDarkColor">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center rounded-full bg-borderDarkColor mt-2">
            <Image
              src={post.user.profile_photo.url}
              className="rounded-full"
              alt="User"
              width={50}
              height={50}
            />
          </div>
          <div className="w-full">
            <Link
              href={`/${post.user.username.toLowerCase().replaceAll(" ", "")}/${
                post.slug
              }`}
            >
              <h1 className="text-base font-medium text-black dark:text-grayWhite cursor-pointer">
                {post.title}
              </h1>
            </Link>
            <Link href={`/${post.user.username}`}>
              <p className="dark:text-paragraphDarkColor text-paragraphLightColor text-md mt-1 cursor-pointer">
                {post.user.name}
              </p>
            </Link>
            <footer className="flex items-center gap-4 my-3 text-gray-700 dark:text-gray-200">
              <button className="flex items-center gap-2">
                <div className="w-4 ">
                  <i className="uil uil-thumbs-up text-xl"></i>
                </div>
                <span className="text-paragraphColor">{post.likes.total}</span>
              </button>
              <button className="flex items-center gap-2">
                <div className="w-4 ">
                  <i className="uil uil-comment-alt text-xl"></i>
                </div>
                <span className="text-paragraphColor">
                  {post.commentsCount}
                </span>
              </button>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingCard;
