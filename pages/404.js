import Link from "next/link";
import Header from "../src/components/headers/Header";
import Head from "next/head";

const PageNotFound = () => {
  return (
    <>
      <Head>
        <title>Sorry :) Page not found</title>
      </Head>
      <Header />
      <div className="flex items-center flex-col justify-center min-h-screen bg-white dark:bg-mainBackground">
        <h1 className="text-3xl text-mainBackground mb-4 dark:text-white">
          Page not found
        </h1>
        <Link href="/">
          <button className="btn-secondary">Back</button>
        </Link>
      </div>
    </>
  );
};

export default PageNotFound;
