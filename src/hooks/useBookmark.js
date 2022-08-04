import { useState } from "react";

const useBookmark = () => {
  const [bookmarkState, setBookmarkState] = useState(false);

  const bookmark = (details) => {
    console.log({ bookmark: details });

    if (JSON.stringify(details) === "{}") return;

    setBookmarkState(!bookmarkState);

    const bookmarkExist = JSON.parse(localStorage.getItem("bookmarks")) || [];

    if (bookmarkExist.length > 0) {
      const bookmarkFound = bookmarkExist.find(
        (bookmark) => bookmark === details._id.toString()
      );

      if (bookmarkFound) {
        const index = bookmarkExist.indexOf(bookmarkFound);
        bookmarkExist.splice(index, 1);
        localStorage.setItem("bookmarks", JSON.stringify(bookmarkExist));
      } else {
        bookmarkExist.push(details._id.toString());
        localStorage.setItem("bookmarks", JSON.stringify(bookmarkExist));
      }
    } else {
      bookmarkExist.push(details._id.toString());
      localStorage.setItem("bookmarks", JSON.stringify(bookmarkExist));
    }
  };

  const checkBookmark = (details) => {
    if (JSON.stringify(details) === "{}") return;

    const bookmarkExist = JSON.parse(localStorage.getItem("bookmarks")) || [];

    if (bookmarkExist.includes(details._id.toString())) {
      setBookmarkState(true);
    } else {
      setBookmarkState(false);
    }
  };

  return [bookmarkState, bookmark, checkBookmark];
};

export default useBookmark;
