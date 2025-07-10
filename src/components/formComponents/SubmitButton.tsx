import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

interface SubmitButtonProps {
  children: React.ReactNode;
  width?: string; // Ejemplo: "w-full", "w-40", etc.
  className?: string;
  loading?: boolean;
}

const SubmitButton = ({
  children,
  width = "w-auto",
  className = "",
  loading = false,
  ...props
}: SubmitButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="submit"
    className={`bg-[#2AAC67] text-white font-bold py-3 px-10 rounded-xl hover:bg-opacity-90 transition ${width} ${className} hover:bg-[#24965c] transition duration-200`}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading ? (
      <span className="flex items-center justify-center gap-2">
        <CircularProgress size={20} style={{ color: "#fff" }} />
        <span>Cargando...</span>
      </span>
    ) : (
      children
    )}
  </button>
);

export default SubmitButton;