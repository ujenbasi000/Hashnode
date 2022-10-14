import { useMutation } from "@apollo/client";
import { UPLOAD_QUERY } from "../../helpers/gql/mutation";
import Image from "next/image";
import { useState } from "react";

const Step3 = ({ details, setDetails }) => {
  const [uploadProfile] = useMutation(UPLOAD_QUERY);
  const [fileUploading, setFileUploading] = useState(false);

  const handleFileUpload = async (e) => {
    setFileUploading(true);
    const {
      data: {
        uploadImage: { url, cloud_id },
      },
    } = await uploadProfile({
      variables: {
        file: e.target.files[0],
      },
    });
    console.log({ url, cloud_id });

    setFileUploading(false);

    if (url) {
      setDetails({ ...details, profile_photo: { url, cloud_id } });
    }
  };
  return (
    <div className="grid place-content-center text-center">
      <label
        htmlFor="profile"
        className="text-paragraphLightColor dark:text-paragraphDarkColor text-center mb-4 block"
      >
        Profile
      </label>
      <input
        type="file"
        name="profile"
        id="profile"
        hidden
        onChange={handleFileUpload}
      />
      <label
        htmlFor="profile"
        className="min-w-[5rem] min-h-[5rem] w-full h-full grid place-content-center cursor-pointer rounded-full bg-secondaryBackground  text-paragraphDarkColor dark:text-paragraphLightColor"
      >
        {details.profile_photo.url ? (
          <Image
            src={details.profile_photo.url}
            alt=""
            width={90}
            height={90}
            className="rounded-full object-cover"
          />
        ) : fileUploading ? (
          "Loading..."
        ) : (
          <i className="uil uil-upload text-3xl"></i>
        )}
      </label>
    </div>
  );
};

export default Step3;
