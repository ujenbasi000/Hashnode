import Image from "next/image";
import Link from "next/link";

const Tag = ({ details }) => {
  return (
    <div className="p-4 rounded-md border border-borderLightColor dark:border-borderDarkColor bg-grayWhite dark:bg-secondaryBackground ">
      <Link href={`/tags/${details.name}`}>
        <div className="flex gap-3 cursor-pointer">
          <Image
            src={details.logo.url}
            alt=""
            width={40}
            height={40}
            className="rounded-md object-cover"
          />
          <div>
            <h4 className="text-sm font-medium text-black dark:text-white">
              #{details.name}
            </h4>
            <h4 className="text-sm font-medium text-paragraphLightColor dark:text-paragraphDarkColor">
              {details.articles} articles this week
            </h4>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Tag;
