import { Header, Login, Register, Toast } from "../src/components";
import { useState, useContext, useEffect } from "react";
import { ctx } from "../src/helpers/context/post.context";
import { validator } from "../src/helpers/miniFunctions";
import { CREATE_USER } from "../src/helpers/gql/mutation";
import { useMutation } from "@apollo/client";
import { setCookie } from "cookies-next";
import client from "../src/helpers/config/apollo-client";
import { GET_USER_STATUS } from "../src/helpers/gql/query";
import { registerUser } from "../src/helpers/miniFunctions";
import Head from "next/head";
import { useRouter } from "next/router";

const onboard = () => {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [details, setDetails] = useState({
    name: "",
    email: "",
    password: "",
    username: "",
    profile_photo: {
      url: "",
      cloud_id: "",
    },
  });
  const [createUser] = useMutation(CREATE_USER);
  const { toast, setToast } = useContext(ctx);

  const [valid, setValid] = useState(false);
  const [loginComp, setLoginComp] = useState(
    router.query.s === "login" ? true : false
  );

  useEffect(() => {
    if (router.query.s === "login") {
      setLoginComp(true);
    } else {
      setLoginComp(false);
    }
  }, [router.query]);

  const [loading, setLoading] = useState(false);

  const handleChange = (e, value, setValue) => {
    let isValid1 = false,
      isValid2 = false;

    switch (e.target.name) {
      case "email":
        isValid1 = validator.isEmail(e.target.value);
        isValid1 ? setValid(true) : setValid(false);
        break;
      case "password":
        isValid2 = validator.isPassword(e.target.value);
        isValid2 ? setValid(true) : setValid(false);
        break;
      default:
        setValid(true);
        break;
    }

    setValue({ ...value, [e.target.name]: e.target.value });
  };

  console.log(loading);
  const handleSubmit = async () => {
    registerUser(details, createUser, setCookie, setLoading, setToast);
  };

  return (
    <>
      <Head>
        <title>🚀 Hashnode | Clone 👋</title>
      </Head>
      <Header />
      {toast.status && (
        <Toast type={toast.type} msg={toast.msg} setToast={setToast} />
      )}
      <div className="dark:bg-mainBackground bg-grayWhite h-[calc(100vh-75px)] flex items-center justify-center">
        <div className="w-11/12 md:max-w-[30rem]">
          {loginComp ? (
            <Login handleChange={handleChange} />
          ) : (
            <Register
              step={step}
              details={details}
              setDetails={setDetails}
              handleChange={handleChange}
              valid={valid}
              setValid={setValid}
              setStep={setStep}
              loading={loading}
              handleSubmit={handleSubmit}
            />
          )}
          <div className="mt-4 text-center">
            <p
              className="cursor-pointer text-black dark:text-white"
              onClick={() => {
                setLoginComp((prev) => !prev);
                if (router.query.s === "login") {
                  router.push("/onboard");
                } else {
                  router.push("/onboard?s=login");
                }
              }}
            >
              {loginComp
                ? "Don't have an account? "
                : "Already have an account? "}
              <span className="text-blueColor font-medium">
                {loginComp ? "Register" : "Login"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default onboard;

export const getServerSideProps = async (ctx) => {
  if (ctx.req.cookies.token) {
    const {
      data: { getUser: data },
    } = await client.query({
      query: GET_USER_STATUS,
      context: {
        headers: {
          authorization: `Bearer ${ctx.req.cookies.token}`,
        },
      },
    });

    if (data.user) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    } else {
      return {
        props: {},
      };
    }
  } else {
    return {
      props: {},
    };
  }
};
