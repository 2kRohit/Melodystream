import React from "react";

export default function Container({ children, className }) {
  return (
    <div className={"bg-gray-900 border-4 border-gray-600 max-w-screen-xl mx-auto " + className}>{children}</div>
  );
}
