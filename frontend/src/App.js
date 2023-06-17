import React from "react";
import { Routes, Route } from "react-router-dom";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";
import EmailVerification from "./components/auth/EmailVerification";
import Home from "./components/Home";
import Navbar from "./components/user/Navbar";
import ForgetPassword from "./components/auth/ForgetPassword";
import ConfirmPassword from "./components/auth/ConfirmPassword";
import NotFound from "./components/NotFound";
import Dashboard from "./components/video/Dashboard";
import Music from "./music/Music";
import Uploadvideo from "./components/video/Uploadvideo";
import Unverifiedvideos from "./components/video/Unverifiedvideos";
import ViewUnverifiedVideos from "./components/video/viewUnverifiedvideos";
import Verifiedvideos from "./components/video/Verifiedvideos";
import ViewverifiedVideos from "./components/video/Viewverifiedvideos";
import CategoryForm from "./components/video/Category";
import Viewvideo from "./components/video/Viewvideo";
import Profile from "./components/video/Profile";
import Categories from "./components/video/Categories";
import Search from "./components/video/Search";
import Tag from "./components/video/Tags";
import Viewhistory from "./components/video/Viewhistory";
import Viewsaved from "./components/video/Viewsaved";
export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/signin" element={<Signin />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/verification" element={<EmailVerification />} />
        <Route path="/auth/forget-password" element={<ForgetPassword />} />
        <Route path="/auth/reset-password" element={<ConfirmPassword />} />
        <Route path="/auth/video" element={<Dashboard/>} />
        <Route path="/auth/music" element={<Music/>} />
        <Route path="/auth/upload-video" element={<Uploadvideo/>} />
        <Route path="/auth/unverified-videos" element={<Unverifiedvideos/>} />
        <Route path="/viewunverifiedvideo" element={<ViewUnverifiedVideos/>} />
        <Route path="/auth/verified-videos" element={<Verifiedvideos/>} />
        <Route path="/viewverifiedvideo" element={<ViewverifiedVideos/>} />
        <Route path="/viewvideo" element={<Viewvideo/>} />
        <Route path="/addcategory" element={<CategoryForm/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/categories" element={<Categories/>} />
        <Route path="/search" element={<Search/>} />
        <Route path="/tag" element={<Tag/>} />
        <Route path="/viewhistory" element={<Viewhistory/>} />
        <Route path="/viewsaved" element={<Viewsaved/>} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </>
  );
}
