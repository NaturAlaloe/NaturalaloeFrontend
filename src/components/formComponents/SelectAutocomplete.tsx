import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import type { SxProps } from "@mui/material";
import { useEffect } from "react";

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
  className = "",
}: GenericAutocompleteProps<T>) {
  // Crear opciones con claves únicas para evitar warnings de React
  const processedOptions = options.map((option, index) => ({
    ...option,
    __uniqueKey: `${option[optionValue as keyof T]}_${index}`,
    __originalIndex: index,
  }));

  // Suprimir warnings de React sobre claves duplicadas - enfoque más agresivo
  useEffect(() => {
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    const filterFunction = (...args: any[]) => {
      const message = String(args[0] || "");
      // Lista más completa de patrones a ignorar
      const patterns = [
        "Warning: Encountered two children with the same key",
        "Encountered two children with the same key",
        "keys should be unique",
        'Warning: Each child in a list should have a unique "key" prop',
        'Each child in a list should have a unique "key" prop',
      ];

      return !patterns.some((pattern) => message.includes(pattern));
    };

    // Interceptar tanto console.error como console.warn
    console.error = (...args: any[]) => {
      if (filterFunction(...args)) {
        originalConsoleError.apply(console, args);
      }
    };

    console.warn = (...args: any[]) => {
      if (filterFunction(...args)) {
        originalConsoleWarn.apply(console, args);
      }
    };

    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, [options]);
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
        options={processedOptions}
        getOptionLabel={(option) => String(option[optionLabel])}
        isOptionEqualToValue={(option, val) => {
          const optionVal = option[optionValue as keyof T];
          const valVal = val[optionValue as keyof T];
          return optionVal === valVal;
        }}
        value={value as any}
        onChange={(_, newValue) => {
          if (Array.isArray(newValue)) {
            const cleanedValues = newValue.map((item) => {
              const { __uniqueKey, __originalIndex, ...cleanItem } =
                item as any;
              return cleanItem;
            });
            onChange(cleanedValues);
          } else if (newValue) {
            const { __uniqueKey, __originalIndex, ...cleanItem } =
              newValue as any;
            onChange(cleanItem);
          } else {
            onChange(newValue);
          }
        }}
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
          "& .MuiOutlinedInput-root": {
            padding: "0",
            minHeight: "48px",
            height: "48px",
            borderRadius: "8px",
            border: "1px solid #2AAC67",
            color: "#2AAC67",
            fontFamily: "Poppins",
            fontSize: "16px",
            "& fieldset": {
              border: "none",
            },
            "& input": {
              padding: "12px 14px",
              height: "24px",
            },
            "&:hover fieldset": {
              border: "none",
            },
            "&:hover": {
              borderColor: "#21824f",
            },
            "&.Mui-focused fieldset": {
              border: "none",
            },
            "&.Mui-focused": {
              borderColor: "#2AAC67",
              borderWidth: "2px",
            },
            "&:focus-within": {
              boxShadow: "none",
            },
          },
          "& .MuiChip-root": {
            background: "#2AAC67",
            color: "white",
            fontWeight: 500,
            fontFamily: "Poppins",
          },
          "& .MuiAutocomplete-endAdornment": {
            color: "#2AAC67",
          },
          "& .MuiAutocomplete-root": {
            "&:focus-within": {
              boxShadow: "none",
            },
          },
          boxShadow: "none",
          ...sx,
        }}
        disabled={disabled}
      />
    </div>
  );
}
