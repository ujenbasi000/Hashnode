import Head from "next/Head";
import {
  FooterContainer,
  Header,
  SearchList,
  SideBar,
  Toast,
} from "../src/components";
import { useContext, useEffect, useState } from "react";
import { ctx } from "../src/helpers/context/post.context";
import { CREATE_TAG_QUERY, UPLOAD_QUERY } from "../src/helpers/gql/mutation";
import { useMutation, useQuery } from "@apollo/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { getTrendingTags, GET_USER_STATUS } from "../src/helpers/gql/query";
import client from "../src/helpers/config/apollo-client";

const newTag = ({ user }) => {
  const { setUser, setTags, searchState, setSearchState, toast, setToast } =
    useContext(ctx);
  const { data, loading, error } = useQuery(getTrendingTags);

  const [tagDetails, setTagDetails] = useState({
    name: "",
    description: "",
    logo: {
      url: "",
      cloud_id: "",
    },
  });

  useEffect(() => {
    setUser(user);
  }, [user]);

  useEffect(() => {
    setSearchState(false);
  }, []);

  useEffect(() => {
    setTags({
      tags: data?.getTrendingTags,
      error,
      loading,
    });
  }, [data]);

  return (
    <>
      <Head>
        <title>🚀 Hashnode | Clone 👋</title>
      </Head>
      <Header />
      {toast.status && (
        <Toast type={toast.type} msg={toast.msg} setToast={setToast} />
      )}
      <div className="dark:bg-mainBackground bg-grayWhite relative px-0 md:px-6">
        <div
          className="absolute top-0 left-0 w-full h-full"
          onClick={() => setSearchState(false)}
        ></div>
        <div
          onClick={() => setSearchState(false)}
          className={`container mx-auto newTag ${
            searchState && "searchactive"
          }`}
        >
          {searchState ? (
            <SearchList />
          ) : (
            <>
              <SideBar />
              <div className="w-full relative z-40 border-x dark:border-borderDarkColor dark:bg-secondaryBackground">
                <div className="py-16 text-center border-b border-borderLightColor dark:border-borderDarkColor">
                  <h1 className="text-4xl font-semibold mb-4 text-mainBackground dark:text-grayWhite">
                    Propose A New Tag
                  </h1>
                  <p className="text-lg text-paragraphLightColor dark:text-paragraphDarkColor">
                    Fill in the details for the new tag
                  </p>
                </div>
                <NewTagBody
                  tagDetails={tagDetails}
                  setTagDetails={setTagDetails}
                  toast={toast}
                  setToast={setToast}
                />
              </div>
            </>
          )}
        </div>
        <FooterContainer />
      </div>
    </>
  );
};

export default newTag;

const NewTagBody = ({ tagDetails, setTagDetails, toast, setToast }) => {
  const [uploadImage] = useMutation(UPLOAD_QUERY);
  const [createNewTag] = useMutation(CREATE_TAG_QUERY);
  const [fileUploading, setFileUploading] = useState(false);
  const router = useRouter();

  const uploadTagLogo = async (e) => {
    const file = e.target.files[0];
    setFileUploading(true);
    const {
      data: {
        uploadImage: { url, cloud_id },
      },
    } = await uploadImage({
      variables: {
        file,
      },
    });
    setFileUploading(false);
    setTagDetails({
      ...tagDetails,
      logo: { url, cloud_id },
    });
  };

  const handleCreateTag = async () => {
    const {
      data: { createTag },
    } = await createNewTag({
      variables: {
        input: tagDetails,
      },
    });

    if (createTag.success) {
      setTagDetails({
        name: "",
        description: "",
        logo: {
          url: "",
          cloud_id: "",
        },
      });
      setToast({
        status: true,
        type: "success",
        msg: "Tag created successfully",
      });
      setTimeout(() => {
        router.push("/explore");
      }, 500);
    }
  };

  const handleNameChange = (e) => {
    setTagDetails({
      ...tagDetails,
      [e.target.name]: e.target.value.replaceAll(" ", "-").trim().toLowerCase(),
    });
  };

  return (
    <div className="px-10 py-7">
      <div className="mb-6 flex justify-center items-center flex-col">
        <input
          type="file"
          name="logo"
          id="logo"
          hidden
          onChange={uploadTagLogo}
        />
        <label
          htmlFor="logo"
          className="block mb-2 text-lg gray-700 text-gray-700 dark:text-gray-200"
        >
          Tag Logo
        </label>
        <label
          htmlFor="logo"
          className="w-20 h-20 dark:bg-secondaryBackground rounded-full grid place-content-center border border-borderLightColor dark:border-borderDarkColor cursor-pointer"
        >
          {tagDetails?.logo?.url ? (
            <Image
              src={tagDetails?.logo?.url}
              width={150}
              height={150}
              alt=""
              className="object-cover rounded-full"
            />
          ) : (
            <i className="uil uil-image-upload text-4xl text-mainBackground dark:text-white" />
          )}
        </label>
        <label
          htmlFor="logo"
          className="block text-blueColor text-lg mt-4 cursor-pointer"
        >
          {fileUploading ? "Uploading..." : "Upload an image"}
        </label>
      </div>
      <div className="rounded-md overflow-hidden flex justify-start border border-borderLightColor dark:border-borderDarkColor my-6">
        <label
          htmlFor={"name"}
          className={`cursor-pointer px-6 py-3 text-mainBackground dark:text-white dark:bg-borderDarkColor block text-md`}
        >
          Name:{" "}
        </label>
        <input
          type={"text"}
          name={"name"}
          value={tagDetails.name}
          onChange={(e) => handleNameChange(e)}
          id={"name"}
          autoComplete="off"
          className={`px-4 py-2 flex-1 outline-none bg-transparent ${`text-md`}`}
        />
      </div>
      <div className="rounded-md overflow-hidden flex justify-start border border-borderLightColor dark:border-borderDarkColor my-6">
        <label
          htmlFor={"name"}
          className={`cursor-pointer px-6 py-3 text-mainBackground dark:text-white dark:bg-borderDarkColor block text-md`}
        >
          Description:{" "}
        </label>
        <input
          type={"text"}
          name={"description"}
          value={tagDetails.description}
          onChange={(e) =>
            setTagDetails({ ...tagDetails, description: e.target.value })
          }
          id={"description"}
          autoComplete="off"
          className={`px-4 py-2 flex-1 outline-none bg-transparent ${`text-md`}`}
        />
      </div>

      <button className="btn-secondary" onClick={handleCreateTag}>
        Submit
      </button>
    </div>
  );
};

export async function getServerSideProps(ctx) {
  let user = null;
  const token = ctx.req.cookies.token;

  if (token) {
    const {
      data: { getUser: data },
    } = await client.query({
      query: GET_USER_STATUS,
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    });
    user = data.user;
  }
  if (!user) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  }

  return {
    props: {
      user: user,
    },
  };
}
