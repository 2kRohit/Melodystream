import React from "react";

export default function FormContainer({ children }) {
  return (
    <div className="bg-gray-900 min-h-screen -mt-5 flex items-center justify-center">
      {children}
    </div>
  );
}
