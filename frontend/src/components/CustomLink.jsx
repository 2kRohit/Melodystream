import React from "react";
import { Link } from "react-router-dom";

export default function CustomLink({ to, children }) {
  return (
    <Link
      className="dark:text-dark-subtle text-dark-subtle dark:hover:text-white hover:text-white transition"
      to={to}
    >
      {children}
    </Link>
  );
}
