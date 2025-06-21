import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import type { SxProps } from "@mui/material";
import type { Dispatch, SetStateAction } from "react";

interface SearchOption {
  [key: string]: any;
}

interface SearchAutocompleteInputProps {
  label?: string;
  busqueda: string;
  setBusqueda: Dispatch<SetStateAction<string>>;
  showSugerencias: boolean;
  setShowSugerencias: Dispatch<SetStateAction<boolean>>;
  resultados: SearchOption[];
  onSelect: (option: SearchOption) => void;
  optionLabelKeys?: string[]; // e.g. ["codigo", "titulo"]
  placeholder?: string;
  sx?: SxProps;
  disabled?: boolean;
}

export default function SearchAutocompleteInput({
  label = "Buscar",
  busqueda,
  setBusqueda,
  showSugerencias,
  setShowSugerencias,
  resultados,
  onSelect,
  optionLabelKeys = ["codigo", "titulo"],
  placeholder = "Buscar...",
  sx = {},
  disabled = false,
}: SearchAutocompleteInputProps) {
  return (
    <div className="flex flex-col col-span-1 mb-6">
      {label && (
        <label className="block text-sm font-semibold text-[#2AAC67] mb-2">
          {label}
        </label>
      )}
      <Autocomplete
        freeSolo
        options={resultados}
        getOptionLabel={(option: string | SearchOption) =>
          typeof option === "string"
            ? option
            : optionLabelKeys.map((key) => option[key]).filter(Boolean).join(" - ")
        }
        inputValue={busqueda}
        onInputChange={(_, value, reason) => {
          setBusqueda(value);
          setShowSugerencias(reason === "input" && value.length > 0);
        }}
        onChange={(_, value) => {
          if (value && typeof value !== "string") {
            onSelect(value as SearchOption);
            setShowSugerencias(false);
          }
        }}
        open={showSugerencias && resultados.length > 0}
        onClose={() => setShowSugerencias(false)}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            variant="outlined"
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
          boxShadow: "none",
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
          '& .MuiAutocomplete-option': {
            backgroundColor: 'white',
            color: '#2AAC67',
            fontWeight: 500,
            fontFamily: 'Poppins',
            fontSize: '16px',
            borderBottom: '1px solid #e6f9f0',
            transition: 'background 0.2s',
            '&:hover': {
              backgroundColor: '#e6f9f0',
              color: '#21824f',
            },
          },
          '& .MuiAutocomplete-option[aria-selected="true"]': {
            backgroundColor: '#2AAC67',
            color: 'white',
          },
          '& .MuiAutocomplete-option.Mui-focused': {
            backgroundColor: '#e6f9f0',
            color: '#2AAC67',
          },
          '& .MuiAutocomplete-endAdornment': {
            color: '#2AAC67',
          },
          ...sx,
        }}
        disabled={disabled}
      />
    </div>
  );
}
