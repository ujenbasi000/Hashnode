import { Bookmarks } from "..";
import { Community } from "..";
import { TrendingTopics } from "..";

const RightSideBar = () => {
  return (
    <div className="relative z-10 xl:block hidden right_sidebar py-4">
      <TrendingTopics />
      <Bookmarks />
      <Community />
    </div>
  );
};

export default RightSideBar;
