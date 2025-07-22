import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import type { SyntheticEvent } from "react";

interface AutocompleteFieldProps {
  label?: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  noOptionsText?: string;
}

export default function AutocompleteField({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  className = "",
  placeholder = "",
  disabled = false,
  noOptionsText = "No hay opciones disponibles",
}: AutocompleteFieldProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-[#2AAC67] mb-2">
          {label}
        </label>
      )}      <Autocomplete
        options={options}
        value={value}
        disabled={disabled}
        onChange={(_: SyntheticEvent, newValue: string | null) =>
          onChange(newValue || "")
        }
        noOptionsText={noOptionsText}
        renderInput={(params) => (
          <TextField
            {...params}
            name={name}
            required={required}
            disabled={disabled}
            placeholder={placeholder}
            className={`bg-white ${className}`}
            sx={{
              minHeight: 32,
              fontSize: 14,
              borderRadius: 1,
              "& .MuiOutlinedInput-root": {
                padding: "0 8px",
                minHeight: 49,
                fontSize: 14,
                borderRadius: 2,
                color: "#2AAC67",
                borderColor: "#2AAC67",
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#000",
                  boxShadow: "none",
                  borderWidth: 2,
                },
                "&.Mui-focused": {
                  boxShadow: "none",
                },
              },
              "& .MuiOutlinedInput-input": {
                padding: "6px 8px",
                fontSize: 16,
                borderRadius: 2,
                "&::placeholder": {
                  color: "#2AAC67",
                  opacity: 1,
                },
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#2AAC67",
              },
            }}
          />
        )}
        slotProps={{
          popper: {
            sx: {
              "& .MuiAutocomplete-option": {
                color: "#2AAC67",
              },
            },
          },
        }}
        isOptionEqualToValue={(option, val) => option === val}
        disableClearable
      />
    </div>
  );
}
