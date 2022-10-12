import { useContext, useState, useRef } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../../helpers/gql/mutation";
import { setCookie } from "cookies-next";
import { ctx } from "../../helpers/context/post.context";

const Login = ({ handleChange }) => {
  const { setToast } = useContext(ctx);
  const passwordRef = useRef(null);
  const [LoginUser] = useMutation(LOGIN_USER);
  const [passwordShow, setPasswordShow] = useState(false);

  const [details, setDetails] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    const {
      data: { loginUser: data },
    } = await LoginUser({
      variables: {
        input: details,
      },
    });

    if (data.success) {
      setCookie("token", data.message.toString(), {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      });

      setToast({
        msg: "Login Successful",
        type: "success",
        status: true,
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }

    if (data.error) {
      setDetails((prev) => ({ ...prev, password: "" }));
      passwordRef.current.focus();
      setToast({
        msg: data.message,
        type: "error",
        status: true,
      });
    }
  };

  return (
    <div className="shadows">
      <div className="py-8 dark:bg-[#222222]">
        <h1 className="text-center text-3xl mb-6 font-semibold dark:text-grayWhite text-mainBackground">
          Login 👋
        </h1>
        <div className="dark:bg-[#1e1e1e96] px-6 py-4">
          <div className="relative my-4">
            <label
              htmlFor="email"
              className="text-md font-medium absolute top-1/2 -translate-y-1/2 text-paragraphLightColor dark:text-paragraphDarkColor left-6"
            >
              Email:
            </label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="email@domain.com"
              autoFocus={true}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              value={details.email}
              onChange={(e) => handleChange(e, details, setDetails)}
              className="dark:bg-mainBackground placeholder:text-paragraphLightColor transition duration-150 border-[3px] pr-4 pl-20 w-full h-14 outline-none border-borderLightColor dark:border-borderDarkColor py-2 px-3 text-paragraphLightColor dark:text-paragraphDarkColor"
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="text-md font-medium absolute top-1/2 -translate-y-1/2 text-paragraphLightColor dark:text-paragraphDarkColor left-6"
            >
              Password:
            </label>
            <input
              type={passwordShow ? "text" : "password"}
              name="password"
              id="password"
              autoComplete="off"
              ref={passwordRef}
              value={details.password}
              onChange={(e) => handleChange(e, details, setDetails)}
              className="dark:bg-mainBackground placeholder:text-paragraphLightColor transition duration-150 border-[3px] pr-4 pl-28 w-full h-14 outline-none border-borderLightColor dark:border-borderDarkColor py-2 px-3 text-paragraphLightColor dark:text-paragraphDarkColor"
            />
            <button
              className="absolute top-1/2 -translate-y-1/2 right-3"
              onClick={() => setPasswordShow((prev) => !prev)}
            >
              {passwordShow ? (
                <i className="uil uil-eye text-black dark:text-white"></i>
              ) : (
                <i className="uil uil-eye-slash text-black dark:text-white"></i>
              )}
            </button>
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={handleSubmit} className="btn-write">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
