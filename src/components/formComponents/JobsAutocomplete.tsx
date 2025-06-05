import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export interface Puesto {
  id: number;
  nombre: string;
}

export interface PuestosAutocompleteProps {
  label?: string;
  puestos: Puesto[];
  value: string[];
  onChange: (newValue: string[]) => void;
}

export default function PuestosAutocomplete({
  label = "Puestos",
  puestos,
  value,
  onChange,
}: PuestosAutocompleteProps) {
  return (
    <div className="flex flex-col col-span-1">
      <label
        className="block text-sm font-semibold text-[#2AAC67] mb-2"
        htmlFor="autocomplete-puestos"
      >
        {label}
      </label>
      <Autocomplete
        multiple
        id="autocomplete-puestos"
        options={puestos}
        getOptionLabel={(option: Puesto) => option.nombre}
        value={puestos.filter((p) => value.includes(p.nombre))}
        onChange={(_, newValue: Puesto[]) =>
          onChange(newValue.map((v) => v.nombre))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="Selecciona puestos"
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
              },
            }}
          />
        )}
        sx={{
          background: "white",
          borderRadius: "8px",
          '& .MuiOutlinedInput-root': {
            padding: '0',
            minHeight: '56px',
            borderRadius: '8px',
            border: '1px solid #2AAC67',
            color: '#2AAC67',
            fontFamily: 'Poppins',
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
        }}
      />
    </div>
  );
}
