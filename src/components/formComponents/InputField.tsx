import type { ChangeEventHandler, InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  value?: string | number; // value ahora es opcional
  onChange?: ChangeEventHandler<HTMLInputElement>;
  className?: string;
}

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
}: InputFieldProps) {
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
        {...(type !== "file" ? { value } : {})}
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