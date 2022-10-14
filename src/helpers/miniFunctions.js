import slugify from "slugify";
import { getCookie } from "cookies-next";
import { format } from "date-fns";
import parser from "html-react-parser";

const handleChange = (e, value, setValue) => {
  setValue({ ...value, [e.target.name]: e.target.value });
};

// Submit Post: @handleSubmit
const handleSubmit = async (
  data,
  postBlog,
  content,
  setContent,
  setToast,
  setData,
  uploadedFile,
  setUploadedFile,
  setUploading
) => {
  const { title, tags } = data;
  const token = getCookie("token");

  // create a slug from title
  const slug = slugify(title, {
    replacement: "-",
    remove: undefined,
    lower: true,
    strict: true,
    locale: "vi",
    trim: true,
  });
  setUploading(true);
  const post = {
    ...data,
    content,
    slug,
    cover_image: {
      url: uploadedFile ? uploadedFile.url : "",
      cloud_id: uploadedFile ? uploadedFile.cloud_id : "",
    },
    tags: tags
      .split(", ")
      .map((tag) => tag.toLowerCase().replaceAll(",", "").replaceAll(" ", "_")),
  };
  const {
    data: { createPost },
  } = await postBlog({
    variables: {
      input: {
        ...post,
      },
    },
    context: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  });
  setUploading(false);
  if (createPost.success) {
    localStorage.removeItem("post");
    setToast({
      type: "success",
      status: true,
      msg: "Post created successfully",
    });
    setContent("");
    setData({
      title: "",
      subtitle: "",
      tags: "",
    });
    setUploadedFile(null);
    window.location.href = "/";
  }
};

const handleEditPost = async (
  data,
  content,
  setContent,
  setData,
  setToast,
  setUploading,
  postBlog,
  uploadedFile,
  setUploadedFile,
  handleOtherFunctions
) => {
  const { __typename, ...rest } = data;
  const post = {
    ...rest,
    content,
    cover_image: {
      url: uploadedFile ? uploadedFile.url : null,
    },
    tags: data.tags
      .split(", ")
      .map((tag) => tag.toLowerCase().replaceAll(",", "").replaceAll(" ", "_")),
  };
  setUploading(true);
  const res = await postBlog({
    variables: {
      input: {
        ...post,
      },
    },
    context: {
      headers: {
        authorization: `Bearer ${getCookie("token")}`,
      },
    },
  });

  setUploading(false);
  if (res.data.updatePost.success) {
    setToast({
      type: "success",
      status: true,
      msg: "Post updated successfully",
    });
    setContent("");
    setData({
      title: "",
      subtitle: "",
      tags: "",
    });
    setUploadedFile(null);
    if (typeof handleOtherFunctions === "function") {
      handleOtherFunctions(post.slug);
    }
  }
};

// Upload Image: @UploadImage
const UploadImage = async (
  e,
  uploadImage,
  setFileUploading,
  setCoverState,
  setUploadedFile,
  handleOtherFunctions,
  setToast
) => {
  const file = e.target.files[0];
  if (file.size <= 5000000) {
    setFileUploading(true);
    try {
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
      typeof setCoverState === "function" && setCoverState(false);
      setUploadedFile({ url, cloud_id });
      if (typeof handleOtherFunctions === "function") {
        handleOtherFunctions(url, cloud_id);
      }
    } catch (err) {
      setToast({
        msg: err.message,
        type: "error",
        status: true,
      });
    }
  } else {
    setToast({
      status: true,
      msg: "File is too Big :(",
      type: "info",
    });
  }
};

const registerUser = async (
  details,
  createHandler,
  setCookie,
  setLoading,
  setToast
) => {
  setLoading(true);
  const {
    data: { registerUser: data },
  } = await createHandler({
    variables: {
      input: details,
    },
  });

  setLoading(false);

  if (data.success) {
    setCookie("token", data.message.toString(), {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });
    setToast({
      msg: "Account created successfully",
      type: "success",
      status: true,
    });
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  } else {
    setToast({
      msg: data.message,
      type: "error",
      status: true,
    });
  }
};

const getDate = (time) => {
  if (time) {
    const date = new Date(+time);
    const today = new Date();
    const diff = today.getTime() - date.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diff / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diff / (1000 * 60));
    const diffSeconds = Math.floor(diff / 1000);
    if (diffDays === 0) {
      if (diffHours === 0) {
        if (diffMinutes === 0) {
          return `${diffSeconds} seconds ago`;
        } else {
          return `${diffMinutes} minutes ago`;
        }
      } else {
        return `${diffHours} hours ago`;
      }
    } else {
      return format(date, "MMM d, yyyy");
    }
  }
};

const readingTime = (text) => {
  if (text) {
    const wordsPerMinute = 200;
    const words = text.split(" ").length;
    const minutes = Math.round(words / wordsPerMinute);
    return minutes === 0 ? 1 : minutes;
  }
};

const validator = {
  isEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },
  isPassword(password) {
    return (
      password.length >= 8 && /\d/.test(password) && /[a-z]/i.test(password)
    );
  },
  isUsername(username) {
    return username.split("").find((char) => char === " ") ? false : true;
  },
  isName(name) {
    return name.length > 4;
  },
};

const reduceText = (desc, length, converter) => {
  if (desc) {
    if (converter) {
      if (desc.length > length) {
        return parser(converter.makeHtml(desc.substring(0, length)) + "...");
      } else {
        return parser(converter.makeHtml(desc));
      }
    } else {
      if (desc.length > length) {
        return parser(desc.substring(0, length) + "...");
      } else {
        return parser(desc);
      }
    }
  }
};

// const formatHtmlToString = (html) => {
//   if (Array.isArray(html)) {
//     let result = "";
//     html.map((e) => {
//       result += e.props.children;
//     });
//     return result;
//   } else {
//     return html?.props?.children;
//   }
// };

const copyToClipboard = (element, setToast) => {
  const copy = document.createElement("button");

  copy.onclick = () => {
    const range = document.createRange();
    range.selectNode(element);
    window.getSelection().addRange(range);
    navigator.clipboard.writeText(element.innerText);
    window.getSelection().removeAllRanges();
    setToast({
      type: "info",
      msg: "Copied to clipboard",
      status: true,
    });
  };

  copy.setAttribute("title", "Copy to clipboard");
  copy.innerHTML = "<i class='uil uil-clipboard'></i>";
  copy.classList.add("copy");
  element.parentElement.classList.add("relative");
  element.appendChild(copy);
};

export {
  handleChange,
  handleSubmit,
  UploadImage,
  registerUser,
  getDate,
  readingTime,
  validator,
  reduceText,
  copyToClipboard,
  handleEditPost,
};
