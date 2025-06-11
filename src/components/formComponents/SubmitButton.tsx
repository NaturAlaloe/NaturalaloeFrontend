import React from "react";

interface SubmitButtonProps {
  children: React.ReactNode;
  width?: string; // Ejemplo: "w-full", "w-40", etc.
  className?: string;
}

const SubmitButton = ({
  children,
  width = "w-auto",
  className = "",
  ...props
}: SubmitButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="submit"
    className={`bg-[#2AAC67] text-white font-bold py-3 px-10 rounded-full hover:bg-opacity-90 transition ${width} ${className} hover:bg-[#24965c] transition duration-200`}
    {...props}
  >
    {children}
  </button>
);

export default SubmitButton;