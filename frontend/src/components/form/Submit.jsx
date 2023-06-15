import React from "react";
import { ImSpinner3 } from "react-icons/im";

export default function Submit({ value, busy }) {
  return (
    <button
      type="submit"
      className="w-full rounded bg-cyan-500 hover:bg-cyan-400 dark:text-white text-white  transition font-bold text-lg cursor-pointer h-10 flex items-center justify-center"
    >
      {busy ? <ImSpinner3 className="animate-spin" /> : value}
    </button>
  );
}

