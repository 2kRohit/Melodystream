import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "../../api/auth";
import { useAuth, useNotification } from "../../hooks";
import { isValidEmail } from "../../utils/helper";
import { commonModalClasses } from "../../utils/theme";
import Container from "../Container";
import CustomLink from "../CustomLink";
import FormContainer from "../form/FormContainer";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import Title from "../form/Title";
import Navbar from "../user/Navbar";

const validateUserInfo = ({ name, email, password }) => {
  const isValidName = /^[a-z A-Z]+$/;

  if (!name.trim()) return { ok: false, error: "Name is missing!" };
  if (!isValidName.test(name)) return { ok: false, error: "Invalid name!" };

  if (!email.trim()) return { ok: false, error: "Email is missing!" };
  if (!isValidEmail(email)) return { ok: false, error: "Invalid email!" };

  if (!password.trim()) return { ok: false, error: "Password is missing!" };
  if (password.length < 8)
    return { ok: false, error: "Password must be 8 characters long!" };

  return { ok: true };
};

export default function Signup() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { authInfo } = useAuth();
  const { isLoggedIn } = authInfo;

  const { updateNotification } = useNotification();

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ok, error } = validateUserInfo(userInfo);

    if (!ok) return updateNotification("error", error);

    const response = await createUser(userInfo);
    if (response.error) return updateNotification("error", response.error);

    navigate("/auth/verification", {
      state: { user: response.user },
      replace: true,
    });
  };

  useEffect(() => {
    // we want to move our user to somewhere else
    if (isLoggedIn&&authInfo.profile.role==="admin") {navigate("/admin/dashboard");}
    else if(isLoggedIn&&authInfo.profile.role==="verifier") {navigate("/verifier/dashboard");}
    else if(isLoggedIn&&authInfo.profile.role==="user"){ navigate('/')}
  }, [isLoggedIn]);

  const { name, email, password } = userInfo;

  return (
    <>
    <Navbar />
    <div className="bg-gray-900 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-gray-900 border-4 border-gray-600 shadow-md rounded px-8 py-6 sm:w-1/2 md:w-1/3 lg:w-1/4">
        <h2 className="text-2xl font-bold mb-6 text-center text-white dark:text-white">Sign Up</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-200 dark:text-gray-200 text-sm font-bold mb-2">Full Name</label>
          <input value={name} name="name" 
        onChange={handleChange} type="text" id="name" className="shadow appearance-none bg-gray-800
         border rounded w-full py-2 px-3 text-white leading-tight 
         focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-200 dark:text-gray-200 text-sm font-bold mb-2">Email</label>
          <input value={email} name="email" onChange={handleChange} type="email" id="email" className="shadow appearance-none
          bg-gray-800
           border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-200 dark:text-gray-200 text-sm font-bold mb-2">Password</label>
          <input  onChange={handleChange}  value={password} name="password" type="password" id="password" className="shadow appearance-none bg-gray-800
           border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="flex items-center justify-between">
          <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Sign Up</button>
        </div>
        <div className="text-center mt-4">
          <span className="text-gray-200 dark:text-gray-200">Already have an account?</span>
          <Link to="/auth/signin" className="text-cyan-500 hover:text-cyan-400 ml-2">Sign In</Link>
        </div>
      </form>
    </div>
</>
  );
}
