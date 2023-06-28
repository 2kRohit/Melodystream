import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useNotification } from "../../hooks";
import { isValidEmail } from "../../utils/helper";
import { commonModalClasses } from "../../utils/theme";
import Container from "../Container";
import CustomLink from "../CustomLink";
import FormContainer from "../form/FormContainer";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import Title from "../form/Title";
import { ImSpinner3 } from "react-icons/im";
import Navbar from "../user/Navbar";

const validateUserInfo = ({ email, password }) => {
  if (!email.trim()) return { ok: false, error: "Email is missing!" };
  if (!isValidEmail(email)) return { ok: false, error: "Invalid email!" };

  if (!password.trim()) return { ok: false, error: "Password is missing!" };
  if (password.length < 8)
    return { ok: false, error: "Password must be 8 characters long!" };

  return { ok: true };
};

export default function Signin() {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { updateNotification } = useNotification();
  const { handleLogin, authInfo } = useAuth();
  const { isPending, isLoggedIn } = authInfo;

  const handleChange = ({ target }) => {
    const { value, name } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ok, error } = validateUserInfo(userInfo);

    if (!ok) return updateNotification("error", error);
    handleLogin(userInfo.email, userInfo.password);
  };

  useEffect(() => {
    // we want to move our user to somewhere else
    if (isLoggedIn&&authInfo.profile.role==="admin") {navigate("/admin/dashboard");}
    else if(isLoggedIn&&authInfo.profile.role==="verifier") {navigate("/verifier/dashboard");}
    else if(isLoggedIn&&authInfo.profile.role==="user"){ navigate('/')}
  }, [isLoggedIn]);
const busy=isPending
  return (
    <>
    <Navbar />
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
  <form onSubmit={handleSubmit} className="bg-gray-900 border-4 border-gray-600 shadow-md rounded px-8 py-6 sm:w-1/2 md:w-1/3 lg:w-1/4">
   

        <h2 className="text-2xl font-bold mb-6 text-center text-white dark:text-white">Login</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-white dark:text-white text-sm font-bold mb-2">Email</label>
          <input  value={userInfo.email} onChange={handleChange} placeholder="john@email.com" name="email" type="email" id="email" 
            className="shadow appearance-none bg-gray-800 border rounded w-full py-2 px-3 text-white dark:text-white leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-white dark:text-white text-sm font-bold mb-2">Password</label>
          <input type="password" placeholder="********" name="password" value={userInfo.password} onChange={handleChange}  id="password" className="shadow appearance-none bg-gray-800 border rounded w-full py-2 px-3 text-white dark:text-white leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="flex items-center justify-between">
          { !busy?(
        <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Sign In</button>
           ):<button className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"><ImSpinner3 className="animate-spin" /></button> } <Link to="/auth/forget-password" className="text-cyan-500 hover:text-cyan-400 text-sm">Forgot Password?</Link>
        </div>
        <div className="text-center mt-4">
          <span className="text-white dark:text-white">Don't have an account?</span>
          <Link to="/auth/signup" className="text-cyan-500 hover:text-cyan-400 ml-2">Register</Link>
        </div>
      </form>
    </div></>
  );
}
