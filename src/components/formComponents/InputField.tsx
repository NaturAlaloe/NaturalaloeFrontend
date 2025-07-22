import type { ChangeEventHandler, InputHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  value?: string | number; // value ahora es opcional
  onChange?: ChangeEventHandler<HTMLInputElement>;
  className?: string;
  endAdornment?: ReactNode;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({
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
  endAdornment,
  ...props
}, ref) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-[#2AAC67] mb-2">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          ref={ref}
          type={type}
          name={name}
          {...(type !== "file" ? { value } : {})}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          readOnly={readOnly}
          pattern={pattern}
          className={`w-full p-3 border border-[#2AAC67] rounded-lg text-[#2AAC67] focus:outline-none focus:ring-0 focus:border-[#2AAC67] focus:border-2 ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""} ${endAdornment ? 'pr-12' : ''} ${className}`}
          {...props}
        />
        {endAdornment && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">{endAdornment}</span>
        )}
      </div>
    </div>
  );
});

InputField.displayName = "InputField";

export default InputField;