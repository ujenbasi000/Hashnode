import Image from "next/image";
import Link from "next/link";
import { Hashnode_logo } from "../../../public/assets/icons";
import User from "../../../public/assets/demo_user.webp";
import { useMutation } from "@apollo/client";
import { FOLLOW_USER } from "../../helpers/gql/mutation";
import { getCookie } from "cookies-next";
import { ctx } from "../../helpers/context/post.context";
import { useState, useContext } from "react";
import { HeaderMenu } from "./Header";
import { useEffect } from "react";

const BlogHeader = ({ details }) => {
  const [followFunction] = useMutation(FOLLOW_USER);
  const { setToast, user, setTheme } = useContext(ctx);
  const [openMenu, setOpenMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasFollowed, setHasFollowed] = useState(false);

  useEffect(() => {
    checkFollow();
  }, [user, details]);

  const checkFollow = () => {
    if (user && details) {
      setHasFollowed(user?.following?.includes(details?.user?._id));
    } else {
      setHasFollowed(false);
    }
  };

  const follow = async () => {
    const token = getCookie("token");
    if (!token) {
      return setToast({
        type: "error",
        msg: "You must be logged in to follow a user",
        status: true,
      });
    }
    try {
      setLoading(true);
      const {
        data: { followUser: data },
      } = await followFunction({
        variables: {
          input: {
            user: details.user._id,
          },
        },
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      });
      setLoading(false);
      if (data.message === "User Unfollowed") {
        setHasFollowed(false);
      } else {
        setHasFollowed(true);
      }
      if (data.success) {
        setToast({
          type: "success",
          msg: data.message,
          status: true,
        });
      }
    } catch (err) {
      setLoading(false);

      setToast({
        type: "error",
        msg: err,
        status: true,
      });
    }
  };

  return (
    <div className="dark:bg-primaryBackground w-full border-b border-borderLightColor dark:border-borderDarkColor px-4">
      <div className="container flex flex-col md:flex-row items-center justify-between mx-auto py-6">
        <div className="flex items-center gap-3">
          <Link href={`/${details?.user?.username}`}>
            <div className="flex items-center gap-3 cursor-pointer">
              {details?.user?.profile_photo?.url && (
                <Image
                  src={details?.user?.profile_photo?.url}
                  width={50}
                  height={50}
                  className="rounded-full object-cover"
                  alt="User"
                />
              )}
              <h4 className="text-xl font-semibold text-mainBackground dark:text-grayWhite">
                {details?.user?.name}
              </h4>
            </div>
          </Link>
          {user?._id !== details.user._id && (
            <button
              className="btn-secondary ml-6 flex items-center justify-center gap-3"
              onClick={follow}
            >
              {loading ? (
                "Loading..."
              ) : user?._id ? (
                hasFollowed ? (
                  <>
                    <i className="text-blueColor text-xl uil uil-check"></i>
                    <span className="text-blueColor">Following</span>
                  </>
                ) : (
                  <>
                    <i className="text-blueColor text-xl uil uil-plus"></i>
                    <span className="text-blueColor">Follow</span>
                  </>
                )
              ) : (
                <>
                  <i className="text-blueColor text-xl uil uil-plus"></i>
                  <span className="text-blueColor">Follow</span>
                </>
              )}
              {/* Follow */}
            </button>
          )}
        </div>
        <div className="flex items-center justify-between w-1/2 mt-6 md:mt-0">
          <Link href={"/"}>
            <button>
              <Hashnode_logo font={40} />
            </button>
          </Link>

          <div className="flex items-center gap-2">
            <button className="rounded-full hover:bg-gray-200 hover:dark:bg-gray-700">
              <div
                onClick={() =>
                  setTheme((theme) => (theme === "dark" ? "light" : "dark"))
                }
                className="w-10 h-10 grid place-content-center"
              >
                <i className="uil uil-moon dark:uil-sun text-2xl text-gray-600 dark:text-gray-200"></i>
              </div>
            </button>
            <button className="rounded-full hover:bg-gray-200 hover:dark:bg-gray-700 hidden sm:block">
              <div className="w-10 h-10 grid place-content-center">
                <i className="uil uil-bell text-2xl text-gray-600 dark:text-gray-200"></i>
              </div>
            </button>
            <div className="relative">
              <button
                className="flex items-center justify-center ml-3 w-[40px]"
                onClick={() => setOpenMenu((prev) => !prev)}
              >
                <Image
                  className="rounded-full object-cover"
                  src={
                    user
                      ? user?.profile_photo?.url
                        ? user.profile_photo.url
                        : User
                      : User
                  }
                  width={70}
                  height={70}
                  alt="User"
                />
              </button>
              {openMenu && <HeaderMenu user={user} setOpenMenu={setOpenMenu} />}
            </div>
          </div>
        </div>
      </div>
      <div className="py-3 flex items-center justify-between container mx-auto">
        <ul>
          <li className="btn-tab">
            <Link href={`/${details?.user?.username}`}>Home</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BlogHeader;
