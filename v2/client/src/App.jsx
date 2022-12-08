import Navbar from "./components/Navbar.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "./components/screen/Home.jsx";
import Profile from "./components/screen/Profile.jsx";
import Login from "./components/screen/Login.jsx";
import Signup from "./components/screen/Signup.jsx";
import CreatePost from "./components/screen/CreatePost.jsx";
import UserProfile from "./components/screen/UserProfile.jsx";
import ProfileUpdate from "./components/abstracts/ProfileUpdate.jsx";
import Reset from "./components/screen/Reset.jsx";
import NewPassword from "./components/screen/NewPassword.jsx";
import Search from "./components/screen/Search.jsx";
import { ToastContainer } from "react-toastify";
import { useGlobalContext } from "./context.jsx";

const Routing = () => {
  const nav = useNavigate();
  const location = useLocation();
  const { dispatch } = useGlobalContext();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
        if (!location.pathname.startsWith("/newpassword")) {
          nav("/login");
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/profile" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/u/:userName" element={<UserProfile />} />
      <Route path="/profile/update" element={<ProfileUpdate />} />
      <Route path="/reset" element={<Reset />} />
      <Route path="/newpassword/:token" element={<NewPassword />} />
      <Route path="/search" element={<Search />} />
    </Routes>
  );
};

export default function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer />
      <Routing />
    </Router>
  );
}
