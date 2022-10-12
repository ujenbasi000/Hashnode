import { useState, createContext } from "react";
import { useEffect, useRef } from "react";

export const ctx = createContext();

const PostCtx = ({
  children,
  overlay,
  setOverlay,
  openMenu,
  setOpenMenu,
  setTheme,
  isOpen,
  setIsOpen,
  socket,
  currentUser,
  setCurrentUser,
}) => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [searchedPosts, setSearchedPosts] = useState([]);
  const [searchLoading, setSearchLoading] = useState(true);
  const [tags, setTags] = useState({
    tags: [],
    error: null,
    loading: true,
  });
  const [searchState, setSearchState] = useState(false);
  const inputRef = useRef(null);
  const [user, setUser] = useState({});
  const [toast, setToast] = useState({
    status: false,
    msg: "",
    type: "",
  });

  const toggle = () => {
    setOverlay(false);
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isOpen) {
      document.querySelector("body").classList.add("overflow-hidden");
    } else {
      document.querySelector("body").classList.remove("overflow-hidden");
    }
  }, [isOpen]);

  useEffect(() => {
    if (inputRef.current) {
      window.addEventListener("keydown", (e) => {
        if (
          document.activeElement.tagName === "INPUT" ||
          document.activeElement.tagName === "TEXTAREA"
        ) {
          return;
        } else {
          if (e.key === "/") {
            e.preventDefault();
            inputRef.current.focus();
          }
        }
      });
    }
    return () =>
      window.removeEventListener(
        "keydown",
        () => {
          console.log("exit");
        },
        false
      );
  }, []);

  return (
    <ctx.Provider
      value={{
        inputRef,
        posts,
        setPosts,
        search,
        setSearch,
        searchedPosts,
        setSearchedPosts,
        tags,
        setTags,
        searchState,
        setSearchState,
        searchLoading,
        setSearchLoading,

        toast,
        setToast,

        user,
        setUser,

        isOpen,
        setIsOpen,

        toggle,

        overlay,
        setOverlay,

        openMenu,
        setOpenMenu,

        setTheme,

        socket,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </ctx.Provider>
  );
};

export default PostCtx;
