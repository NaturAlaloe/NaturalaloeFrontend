import React from "react";

export default function InputField({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = false,
  readOnly = false,
  pattern,
  className = "",
  ...props
}) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-[#2AAC67] mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        pattern={pattern}
        className={`w-full p-3 border border-[#2AAC67] rounded-lg text-[#2AAC67] ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""} ${className}`}
        {...props}
      />
    </div>
  );
}