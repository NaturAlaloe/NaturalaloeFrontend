import { TextField } from "@mui/material";

interface ProfileFieldProps {
  label: string;
  name: string;
  value: string;
  editing?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  multiline?: boolean;
  type?: string;
  disabled?: boolean;
}

export default function ProfileField({
  label,
  name,
  value,
  editing = false,
  onChange,
  multiline = false,
  type = "text",
  disabled = false
}: ProfileFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-emerald-900 mb-1"> {/* Verde más intenso */}
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
          disabled={disabled}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#34d399', // Verde medio
              },
              '&:hover fieldset': {
                borderColor: '#10b981', // Verde fuerte
              },
              '&.Mui-focused fieldset': {
                borderColor: '#047857', // Verde más oscuro
              },
            }
          }}
        />
      ) : (
        <p className="text-gray-800 py-2 px-3 bg-emerald-50 rounded-md">
          {value || <span className="text-emerald-400">-</span>}
        </p>
      )}
    </div>
  );
}
