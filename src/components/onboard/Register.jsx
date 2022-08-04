import { Step0, Step1, Step2, Step3 } from "../";

const Register = ({
  step,
  details,
  setDetails,
  handleChange,
  valid,
  setStep,
  setValid,
  handleSubmit,
}) => {
  return (
    <div className="shadows">
      <div className="py-8 dark:bg-[#222222]">
        <h1 className="text-center text-3xl mb-6 font-semibold text-black dark:text-grayWhite">
          JOIN THE PLATFORM 👋
        </h1>
        <div className="w-11/12 mx-auto">
          <p className="text-lg text-center mb-2 text-paragraphLightColor dark:text-paragraphDarkColor">
            {step} out of 4 step Complete
          </p>
          <div className="w-10/12 mx-auto h-2 dark:bg-grayColor rounded-sm overflow-hidden">
            <div className={`width width-${step} h-2 bg-blueColor`}></div>
          </div>
        </div>
      </div>
      <div className="dark:bg-[#1e1e1e96] px-6 py-4">
        {step === 0 ? (
          <Step0
            details={details}
            setDetails={setDetails}
            handleChange={handleChange}
          />
        ) : step === 1 ? (
          <Step1
            details={details}
            setDetails={setDetails}
            handleChange={handleChange}
          />
        ) : step === 2 ? (
          <Step2
            details={details}
            setDetails={setDetails}
            handleChange={handleChange}
          />
        ) : step === 3 ? (
          <Step3 details={details} setDetails={setDetails} />
        ) : null}
        <div className="flex gap-3 justify-end mt-4">
          {step === 3 ? (
            <>
              <button
                className={`btn-write`}
                onClick={() => {
                  setStep((prev) => (prev === 0 ? prev : prev - 1));
                  // setValid(false);
                }}
              >
                Prev
              </button>
              <button className="btn-write" onClick={handleSubmit}>
                Submit
              </button>
            </>
          ) : (
            <>
              {step !== 0 && (
                <button
                  className={`btn-write`}
                  onClick={() => {
                    setStep((prev) => (prev === 0 ? prev : prev - 1));
                    // setValid(false);
                  }}
                >
                  Prev
                </button>
              )}
              <button
                disabled={!valid}
                className={`btn-write ${
                  valid
                    ? "opacity-100 cursor-pointer"
                    : "opacity-70 cursor-not-allowed"
                }`}
                onClick={() => {
                  valid && setStep((prev) => (prev < 3 ? (prev += 1) : prev));
                  setValid(false);
                }}
              >
                Next
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
