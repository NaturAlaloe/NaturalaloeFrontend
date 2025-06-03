import { TextField } from "@mui/material";

interface ProfileFieldProps {
  label: string;
  name: string;
  value: string;
  editing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  multiline?: boolean;
  type?: string;
}

export default function ProfileField({
  label,
  name,
  value,
  editing,
  onChange,
  multiline = false,
  type = "text"
}: ProfileFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-emerald-700 mb-1"> {/* Verde oscuro */}
        {label}
      </label>
      {editing ? (
        <TextField
          name={name}
          value={value}
          onChange={onChange}
          fullWidth
          size="small"
          multiline={multiline}
          rows={multiline ? 4 : undefined}
          type={type}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#a7f3d0', // Verde claro
              },
              '&:hover fieldset': {
                borderColor: '#34d399', // Verde medio
              },
              '&.Mui-focused fieldset': {
                borderColor: '#059669', // Verde más oscuro
              },
            }
          }}
        />
      ) : (
        <p className="text-gray-800 py-2 px-3 bg-emerald-50 rounded-md"> {/* Fondo verde claro */}
          {value || <span className="text-emerald-400">-</span>}
        </p>
      )}
    </div>
  );
}