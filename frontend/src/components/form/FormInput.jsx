import React from "react";

export default function FormInput({ name, label, placeholder, ...rest }) {
  return (
    <div className="flex flex-col-reverse">
      <input
        id={name}
        name={name}
        type="text"
        className=" bg-gray-800 rounded border-2 dark:border-white-subtle border-white-subtle dark:focus:border-white focus:border-white w-full text-lg outline-none p-1 dark:text-white text-white peer transition"
        placeholder={placeholder}
        {...rest}
      />
      <label
        className="font-semibold  text-white dark:peer-focus:text-white peer-focus:text-white transition self-start"
        htmlFor={name}
      >
        {label}
      </label>
    </div>
  );
}
