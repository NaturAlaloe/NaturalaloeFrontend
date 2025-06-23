import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import type { SxProps } from "@mui/material";

export interface GenericAutocompleteProps<T> {
  label?: string;
  options: T[];
  optionLabel: string;
  optionValue: string;
  value: string | object | object[] | null;
  onChange: (value: T | T[] | null) => void;
  multiple?: boolean;
  placeholder?: string;
  sx?: SxProps;
  disabled?: boolean;
  width?: string | number;
  fullWidth?: boolean;
  className?: string;
}

export default function SelectAutocomplete<T extends object>({
  label = "Seleccionar",
  options,
  optionLabel,
  optionValue,
  value,
  onChange,
  multiple = false,
  placeholder = "Selecciona...",
  sx = {},
  disabled = false,
  width,
  fullWidth = true,
  className = "", // Nuevo: permite clases personalizadas
}: GenericAutocompleteProps<T>) {
  return (
    <div
      className={`flex flex-col col-span-1 ${className}`}
      style={{
        width: fullWidth ? "100%" : width,
        minWidth: width,
        maxWidth: fullWidth ? "100%" : width,
      }}
    >
      {label && (
        <label className="block text-sm font-semibold text-[#2AAC67] mb-2">
          {label}
        </label>
      )}
      <Autocomplete
        multiple={multiple}
        options={options}
        getOptionLabel={(option) => String(option[optionLabel])}
        isOptionEqualToValue={(option, val) => option[optionValue] === val[optionValue]}
        value={value as any}
        onChange={(_, newValue) => onChange(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder={placeholder}
            InputLabelProps={{
              style: { color: "#2AAC67", fontWeight: 600 },
            }}
            InputProps={{
              ...params.InputProps,
              style: {
                borderRadius: 8,
                background: "white",
                border: "1px solid #2AAC67",
                color: "#2AAC67",
                padding: "10px",
                fontFamily: "Poppins",
                fontSize: "16px",
                minHeight: "50px",
                height: "50px", 
              },
            }}
          />
        )}
        sx={{
          background: "white",
          borderRadius: "8px",
          minHeight: "48px",
          height: "48px",
          '& .MuiOutlinedInput-root': {
            padding: '0',
            minHeight: '48px',
            height: '48px',
            borderRadius: '8px',
            border: '1px solid #2AAC67',
            color: '#2AAC67',
            fontFamily: 'Poppins',
            fontSize: '16px',
            '& input': {
              padding: '12px 14px',
              height: '24px',
            },
            '&:hover fieldset': {
              borderColor: '#21824f',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2AAC67',
            },
          },
          '& .MuiChip-root': {
            background: '#2AAC67',
            color: 'white',
            fontWeight: 500,
            fontFamily: 'Poppins',
          },
          '& .MuiAutocomplete-endAdornment': {
            color: '#2AAC67',
          },
          boxShadow: 'none',
          ...sx,
        }}
        disabled={disabled}
      />
    </div>
  );
}
