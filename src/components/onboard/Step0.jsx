const Step0 = ({ details, setDetails, handleChange }) => {
  return (
    <div className="relative">
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
        value={details.email}
        onChange={(e) => handleChange(e, details, setDetails)}
        className="dark:bg-mainBackground placeholder:text-paragraphLightColor transition duration-150 border-[3px] pr-4 pl-20 w-full h-14 outline-none border-borderLightColor dark:border-borderDarkColor py-2 px-3 text-paragraphLightColor dark:text-paragraphDarkColor"
      />
    </div>
  );
};

export default Step0;
