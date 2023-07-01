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
import Uploadvideo from "./components/video/Uploadvideo";
import Unverifiedvideos from "./components/video/Unverifiedvideos";
import ViewUnverifiedVideos from "./components/video/viewUnverifiedvideos";
import Verifiedvideos from "./components/video/Verifiedvideos";
import ViewverifiedVideos from "./components/video/Viewverifiedvideos";
import CategoryForm from "./components/Admin/Category";
import Viewvideo from "./components/video/Viewvideo";
import Profile from "./components/video/Profile";
import Categories from "./components/video/Categories";
import Search from "./components/video/Search";
import Tag from "./components/video/Tags";
import Viewhistory from "./components/video/Viewhistory";
import Viewsaved from "./components/video/Viewsaved";
import Admindashboard from "./components/Admin/Dashboard";
import Verifierdashboard from "./components/Verifier/Dashboard";
import Adminuser from "./components/Admin/User";
import Adminverifier from "./components/Admin/Verifier";
import Adminvideos from "./components/Admin/Videos";
import Adminviewvideos from "./components/Admin/Viewvideo";
import Verifierunverifiedvideos from "./components/Verifier/unverifiedvideos";
import Verifierverifiedvideos from "./components/Verifier/verifiedvideos";
import Verifierrejectedvideos from "./components/Verifier/rejectedvideos";
import Verifierviewvideos from "./components/Verifier/viewvideos";
import Verifieruser from "./components/Verifier/User";
import Verifieruserprofile from "./components/Verifier/userprofile";
import Verifierverifiedreports from "./components/Verifier/verifiedreports";
import Verifierunverifiedreports from "./components/Verifier/unverifiedreports";
import Music from "./components/Music/music";
import  Addmusic from "./components/Admin/Addmusic"
import  Addmusiccategory from "./components/Admin/musiccategory"
import  Addmusicmood from "./components/Admin/mood"
import  Addartist from "./components/Admin/artist"
import  Addlanguage from "./components/Admin/language"
import  Viewmusic from "./components/Music/viewmusic"
import  Favourite from "./components/Music/favourite"
import  Musichistory from "./components/Music/history"
import  Adminviewmusic from "./components/Admin/viewmusic"
import  Playlist from "./components/Music/playlist"
import  Viewplaylist from "./components/Music/viewplaylist"
import  Musicsearch from "./components/Music/musicsearch"
import  Adminuserprofile from "./components/Admin/userprofile"
import  Useruserprofile from "./components/video/userprofile"
import Musicprofile from "./components/Music/Profile"
import Adminprofile from "./components/Admin/Profile"
import Verifierprofile from "./components/Verifier/Profile"
import Adminchangepassword from "./components/Admin/changepassword"
import Musicchangepassword from "./components/Music/changepassword"
import Videochangepassword from "./components/video/changepassword"
import Verifierchangepassword from "./components/Verifier/changepassword"
import Artist from "./components/Music/artist"
import Language from "./components/Music/language"
import Mood from "./components/Music/mood"
import Viewsong from "./components/Music/viewsong"
import Categorymusic from "./components/Music/categorymusic"
import All from "./components/Music/all"


export default function App() {
  return (
    <>
     
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/signin" element={<Signin />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/verification" element={<EmailVerification />} />
        <Route path="/auth/forget-password" element={<ForgetPassword />} />
        <Route path="/auth/reset-password" element={<ConfirmPassword />} />
        <Route path="/auth/video" element={<Dashboard/>} />
      
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
        <Route path="admin/dashboard" element={<Admindashboard/>} />
        <Route path="verifier/dashboard" element={<Verifierdashboard/>} />
        <Route path="admin/User" element={<Adminuser/>} />
        <Route path="admin/Verifier" element={<Adminverifier/>} />
        <Route path="admin/videos" element={<Adminvideos/>} />
        <Route path="admin/viewvideos" element={<Adminviewvideos/>} />
        <Route path="verifier/viewverifiedvideos" element={<Verifierviewvideos/>} />
        <Route path="verifier/verifiedvideos" element={<Verifierverifiedvideos/>} />
        <Route path="verifier/unverifiedvideos" element={<Verifierunverifiedvideos/>} />
        <Route path="verifier/rejectedvideos" element={<Verifierrejectedvideos/>} />
        <Route path="verifier/user" element={<Verifieruser/>} />
        <Route path="verifier/verifiedreports" element={<Verifierverifiedreports/>} />
        <Route path="verifier/unverifiedreports" element={<Verifierunverifiedreports/>} />
        <Route path="verifier/userprofile" element={<Verifieruserprofile/>} />
        <Route path="admin/addmusic" element={<Addmusic/>} />
        <Route path="/addartist" element={<Addartist/>} />
        <Route path="/addlanguage" element={<Addlanguage/>} />
        <Route path="/addmusiccategory" element={<Addmusiccategory/>} />
        <Route path="/addmusicmood" element={<Addmusicmood/>} />
        <Route path="/music" element={<Music/>} />
        <Route path="/viewmusic" element={<Viewmusic/>} />
        <Route path="admin/viewmusic" element={<Adminviewmusic/>} />
        <Route path="/favourite" element={<Favourite/>} />
        <Route path="/musichistory" element={<Musichistory/>} />
        <Route path="/playlist" element={<Playlist/>} />
        <Route path="/viewplaylist" element={<Viewplaylist/>} />
        <Route path="/musicsearch" element={<Musicsearch/>} />
        <Route path="/admin/userprofile" element={<Adminuserprofile/>}/>
        <Route path="/user/userprofile" element={<Useruserprofile/>}/>
        <Route path="/music/profile" element={<Musicprofile/>}/>
        <Route path="/admin/profile" element={<Adminprofile/>}/>
        <Route path="/verifier/profile" element={<Verifierprofile/>}/>
        <Route path="/admin/changepassword" element={<Adminchangepassword/>}/>
        <Route path="/music/changepassword" element={<Musicchangepassword/>}/>
        <Route path="/video/changepassword" element={<Videochangepassword/>}/>
        <Route path="/verifier/changepassword" element={<Verifierchangepassword/>}/>
        <Route path="/artist" element={<Artist/>}/>
        <Route path="/language" element={<Language/>}/>
        <Route path="/mood" element={<Mood/>}/>
        <Route path="/viewsong" element={<Viewsong/>}/>
        <Route path="/categorymusic" element={<Categorymusic/>}/>
        <Route path="/all" element={<All/>}/>
        <Route path="*" element={<NotFound />} />

      </Routes>
    </>
  );
}
