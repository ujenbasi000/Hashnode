import { useState } from "react";
const Step1 = ({ details, setDetails, handleChange }) => {
  const [passwordShow, setPasswordShow] = useState(false);

  return (
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
        autoFocus={true}
        autoComplete="off"
        value={details.password}
        onChange={(e) => handleChange(e, details, setDetails)}
        className="dark:bg-mainBackground placeholder:text-paragraphLightColor transition duration-150 border-[3px] pr-4 pl-32 w-full h-14 outline-none border-borderLightColor dark:border-borderDarkColor py-2 px-3 text-paragraphLightColor dark:text-paragraphDarkColor"
      />
      <button
        className="absolute top-1/2 -translate-y-1/2 right-3"
        onClick={() => setPasswordShow((prev) => !prev)}
      >
        {passwordShow ? (
          <i className="uil uil-eye"></i>
        ) : (
          <i className="uil uil-eye-slash"></i>
        )}
      </button>
    </div>
  );
};

export default Step1;
