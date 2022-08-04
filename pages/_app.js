import "../styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import client from "../src/helpers/config/apollo-client";
import PostCtx from "../src/helpers/context/post.context";
import NextNProgress from "nextjs-progressbar";
import { useState, useEffect } from "react";

function MyApp({ Component, pageProps }) {
  const [overlay, setOverlay] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setTheme(localStorage.getItem("theme") || "light");
  }, []);

  useEffect(() => {
    if (theme) {
      if (theme === "dark") {
        document.body.classList.add("dark");
        document.body.classList.remove("light");
      } else {
        document.body.classList.remove("dark");
        document.body.classList.add("light");
      }
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ApolloProvider client={client}>
        <PostCtx
          overlay={overlay}
          setOverlay={setOverlay}
          openMenu={openMenu}
          setTheme={setTheme}
          setOpenMenu={setOpenMenu}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        >
          {overlay && (
            <div
              className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-20"
              onClick={() => {
                setOverlay(false);
                setOpenMenu(false);
                setIsOpen(false);
              }}
            />
          )}
          <NextNProgress color={"#2962FF"} />
          <Component {...pageProps} />
        </PostCtx>
      </ApolloProvider>
    </>
  );
}
export default MyApp;
