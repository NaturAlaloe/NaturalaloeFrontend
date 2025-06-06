import type { ChangeEventHandler, SelectHTMLAttributes } from "react";

interface OptionType {
  [key: string]: any;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  name: string;
  value: string | number;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  options?: OptionType[];
  className?: string;
  optionLabel?: string;
  optionValue?: string;
}

export default function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  disabled = false,
  className = "",
  optionLabel = "nombre",
  optionValue = "nombre",
  ...props
}: SelectFieldProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-[#2AAC67] mb-2">
          {label}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full p-3 border border-[#2AAC67] rounded-lg text-[#2AAC67] ${className}`}
        {...props}
      >
        <option value="" disabled>
          Seleccione {label?.toLowerCase()}
        </option>
        {options.map((opt, i) => (
          <option
            key={opt.codigo ?? opt[optionValue] ?? i}
            value={opt[optionValue] ?? opt}
          >
            {opt[optionLabel] ?? opt}
          </option>
        ))}
      </select>
    </div>
  );
}