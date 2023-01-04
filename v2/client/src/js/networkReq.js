import { toast } from "react-toastify";

// eslint-disable-next-line
const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const appTypeJSON = {
  "Content-Type": "application/json",
};

const authorizedUserTokenNoContent = () => {
  let token = localStorage.getItem("jwt")
  return {
    "Authorization": "Bearer " + token
  }
};

const authorizedUserToken = () => {
  let token = localStorage.getItem("jwt")
  return {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
  }
};

async function PostData(route, method, headers, body) {
  try {
    const newRoute = process.env.CLIENT_HOST + route
    const fetchedData = await fetch(newRoute, {
      method,
      headers,
      body,
    });
    const innerData = await fetchedData.json();
    if (innerData.error) {
      toast.error(innerData.error)
    }
    return innerData;
  } catch (err) {
    toast.error(err);
    console.log(err);
    return;
  }
}

const signupBody = (name, password, email, bio, profilePic) => {
  return JSON.stringify({
    name,
    password,
    email,
    bio,
    profilePic
  })
}

export const SignupData = (name, password, password2, bio, email, profilePic, signupSuccess) => {
  if (password !== password2 || !re.test(email)) {
    return toast.error("Form failure. Enter appropiate and correct data.");
  }
  if (email.length > 45 || name.length > 25 || password.length > 30 || bio.length > 60) {
    return toast.error("Please keep input length to a certain limit!");
  }
  const route = "/signup";
  const method = "post";
  const headers = appTypeJSON;
  if (profilePic !== "") {
    fetchPictureUrl(profilePic).then((data) => {
      const body = signupBody(name, password, email, bio, data.url)
      PostData(route, method, headers, body).then((res) => {
        if (res.error) {
          toast.error(data.error);
          return;
        }
      })
    });
  }
  else {
    const url = "https://res.cloudinary.com/dzmbosl0t/image/upload/v1668322289/tpv5lwkvi1ajqamhfyal.png"
    const body = signupBody(name, password, email, bio, url)
    const data = PostData(route, method, headers, body);
    if (data.error) {
      toast.error(data.error);
      return;
    }
  }
  toast.success("Signed up successfully");
  signupSuccess();
};


async function setupLocalDataHelper (data, dispatch) {
  localStorage.setItem("jwt", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  dispatch({ type: "USER", payload: data.user });
};

export const LoginData = (password, email, loginSuccess, dispatch) => {
  if (!re.test(email)) {
    return toast.error("Form failure. Enter appropiate and correct data.");
  }
  if (email.length > 45 || password.length > 30) {
    return toast.error("Please keep input length to a certain limit!");
  }
  const route = "/signin";
  const method = "post";
  const headers = appTypeJSON;
  const body = JSON.stringify({
    password,
    email,
  });
  PostData(route, method, headers, body).then((data) => {
    if (data.error) {
      toast.error(data.error);
      return;
    }
    setupLocalDataHelper(data, dispatch).then((data) => {
      toast.success("Logged in successfully!");
      loginSuccess();
    });
  });
  return;
};

async function fetchPictureUrl(image) {
  try {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "dzmbosl0t");
    const cloudinary = "https://api.cloudinary.com/v1_1/dzmbosl0t/image/upload";
    const cloudinaryResponse = await fetch(cloudinary, {
      method: "post",
      body: data,
    });
    const innerData = await cloudinaryResponse.json();
    return innerData;
  } catch (err) {
    console.log(err);
    return;
  }
}

export const ImageData = (title, body, image, newPostSuccess) => {
  if (!title || !image) {
    toast.error("Please include a title or image!");
    return;
  }
  if (title.length > 30 || body.length > 120) {
    return toast.error("Please keep input length to a certain limit!");
  }
  fetchPictureUrl(image).then((data) => {
    if (data.error) {
      toast.error(data.error);
      return;
    }
    try {
      const route = "/create-post";
      const method = "post";
      const headers = authorizedUserToken;
      const postBody = JSON.stringify({
        title,
        body,
        url: data.url,
      });
      PostData(route, method, headers, postBody).then((data) => {
        if (data.error) {
          console.log(data.error);
          toast.error(data.error);
          return;
        }
        toast.success("Post was uploaded successfully!");
        newPostSuccess();
      });
    } catch (err) {
      console.log(err);
      return;
    }
  });
  return;
};

export const FeedPostsData = () => {
  const route = "/post-feed";
  const method = "get";
  const headers = authorizedUserTokenNoContent();
  const data = PostData(route, method, headers);
  return data;
};

export const OwnPostsData = () => {
  const route = "/own-post-feed";
  const method = "get";
  const headers = authorizedUserTokenNoContent();
  const data = PostData(route, method, headers);
  return data;
};

export const LikePostData = (postId) => {
  const route = "/like-post";
  const method = "put";
  const headers = authorizedUserToken();
  const body = JSON.stringify({ postId });
  const data = PostData(route, method, headers, body);
  if (data) {
    toast.success("Liked post successfully!");
  }
  return data;
};

export const UnlikePostData = (postId) => {
  const route = "/unlike-post";
  const method = "put";
  const headers = authorizedUserToken();
  const body = JSON.stringify({ postId });
  const data = PostData(route, method, headers, body);
  if (data) {
    toast.success("Disliked post successfully!");
  }
  return data;
};

export const CommentData = (text, postId) => {
  if (text.length > 180) {
    toast.error("Please shorten your comment!");
    return;
  }
  const route = "/comment-post";
  const method = "put";
  const headers = authorizedUserToken();
  const body = JSON.stringify({
    text,
    postId,
  });
  const data = PostData(route, method, headers, body);
  if (data) {
    toast.success("Comment posted sucessfully!");
  }
  return data;
};

export const CommentFeedData = (postId) => {
  const route = "/comment-feed/" + postId;
  const method = "get";
  const headers = authorizedUserToken();
  const data = PostData(route, method, headers);
  return data;
};

export const DeleteCommentData = (postId, commentId) => {
  const route = "/comment-delete";
  const method = "put";
  const headers = authorizedUserToken();
  const body = JSON.stringify({
    postId,
    commentId,
  });
  const data = PostData(route, method, headers, body);
  if (data) {
    toast.success("Comment deleted successfully");
  }
  return data;
};

export const DeletePostData = (postId) => {
  const route = "/delete-post/" + postId;
  const method = "delete";
  const headers = authorizedUserToken();
  const data = PostData(route, method, headers);
  if (data) {
    toast.success("Post deleted successfully");
  }
  return data;
};

export const NotOwnPostsData = (name) => {
    const route = "/user/" + name;
    const method = "get";
    const headers = authorizedUserToken();
    const data = PostData(route, method, headers);
    return data;
}

export const FollowUserData = (followId, name) => {
    const route = "/follow";
    const method = "put";
    const headers = authorizedUserToken();
    const body = JSON.stringify({
        followId,
        name
    });
    const data = PostData(route, method, headers, body);
    return data;
}

export const UnfollowUserData = (unfollowId, name) => {
    const route = "/unfollow";
    const method = "put";
    const headers = authorizedUserToken();
    const body = JSON.stringify({
        unfollowId,
        name
    });
    const data = PostData(route, method, headers, body);
    return data;
}

export const FollowingPostData = () => {
    const route = "/following-feed";
    const method = "get";
    const headers = authorizedUserToken();
    const data = PostData(route, method, headers);
    return data;
}

const UpdateProfileDataHelper = (route, method, headers, pic, bio, updateProfileHelper, changeProfileData) => {
  fetchPictureUrl(pic).then((data) => {
    const body = JSON.stringify({
      bio,
      profilePic:data.url
    })
    PostData(route, method, headers, body).then((data) => {
      updateProfileHelper(data, changeProfileData)
      if (!data.error) {
        toast.success("Profile Updated!")
      }
    })
  })
}

export const UpdateProfileData = (bio, pic, updateProfileHelper, changeProfileData) => {
  const route = "/update-profile";
  const method = "put";
  const headers = authorizedUserToken();
  if (pic && bio) {
    UpdateProfileDataHelper(route, method, headers, pic, bio, updateProfileHelper, changeProfileData)
  }
  else if (!bio && pic) {
    UpdateProfileDataHelper(route, method, headers, pic, undefined, updateProfileHelper, changeProfileData)
  }
  else if (bio && !pic) {
    const body = JSON.stringify({
      bio,
    });
    PostData(route, method, headers, body).then((data) => {
      updateProfileHelper(data, changeProfileData)
      if (!data.error) {
        toast.success("Profile Updated!");
      }
    })
  }
}

export const ResetAccountData = (email, goToSignin) => {
  if (!re.test(email)) {
    return toast.error("Form failure. Enter appropiate and correct data.");
  }
  if (email.length > 45) {
    return toast.error("Please keep input length to a certain limit!");
  }
  const route = "/reset-password";
  const method = "post";
  const headers = appTypeJSON;
  const body = JSON.stringify({
    email 
  });
  PostData(route, method, headers, body).then((data) => {
    if(data.error) {
      toast.error(data.error);
    } else {
      toast.success(data.message);
      goToSignin();
    }
  });
}

export const NewPasswordData = (password, token, goToSignin) => {
  if (password.length > 30) {
    return toast.error("Please keep input length to a certain limit!")
  }
  const route = "/new-password";
  const method = "post";
  const headers = appTypeJSON;
  const body = JSON.stringify({
    password,
    token
  });
  PostData(route, method, headers, body).then((data) => {
    if (data.error) {
      toast.error(data.error);
    }
    else {
      toast.success(data.message)
      goToSignin();
    }
  });
}

export const SearchQueryData = (query, setSearch, goToSearchResults) => {
  if (query.length > 25){
    return toast.error("Please keep input length to a certain limit!")
  }
  const route = "/search-users";
  const method = "post";
  const headers = authorizedUserToken();
  const body = JSON.stringify({
    query
  });
  PostData(route, method, headers, body).then((data) => {
    if (data.error) {
      toast.error(data.error)
    }
    else {
      setSearch(data);
      goToSearchResults();
    }
  });
}