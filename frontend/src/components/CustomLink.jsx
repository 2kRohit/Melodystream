import React from "react";
import { Link } from "react-router-dom";

export default function CustomLink({ to, children }) {
  return (
    <Link
      className="text-white dark:hover:text-blue-500 hover:text-white transition"
      to={to}
    >
      {children}
    </Link>
  );
}
