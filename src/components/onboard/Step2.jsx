const Step2 = ({ details, setDetails, handleChange }) => {
  return (
    <div>
      <div className="relative my-6">
        <label
          htmlFor="name"
          className="text-md font-medium absolute top-1/2 -translate-y-1/2 text-paragraphLightColor dark:text-paragraphDarkColor left-6"
        >
          Name:
        </label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="John Doe"
          autoComplete="off"
          autoFocus={true}
          value={details.name}
          onChange={(e) => handleChange(e, details, setDetails)}
          className="dark:bg-mainBackground placeholder:text-paragraphLightColor transition duration-150 border-[3px] pr-4 pl-24 w-full h-14 outline-none border-borderLightColor dark:border-borderDarkColor py-2 px-3 text-paragraphLightColor dark:text-paragraphDarkColor"
        />
      </div>
      <div className="relative">
        <label
          htmlFor="username"
          className="text-md font-medium absolute top-1/2 -translate-y-1/2 text-paragraphLightColor dark:text-paragraphDarkColor left-6"
        >
          Username:
        </label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="john_doe"
          autoComplete="off"
          value={details.username}
          onChange={(e) => handleChange(e, details, setDetails)}
          className="dark:bg-mainBackground placeholder:text-paragraphLightColor transition duration-150 border-[3px] pr-4 pl-32 w-full h-14 outline-none border-borderLightColor dark:border-borderDarkColor py-2 px-3 text-paragraphLightColor dark:text-paragraphDarkColor"
        />
      </div>
    </div>
  );
};
export default Step2;
