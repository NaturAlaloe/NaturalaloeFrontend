import Checkbox from "@mui/material/Checkbox";

interface StyledCheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export default function StyledCheckbox({
  label = "Activo",
  checked,
  onChange,
  className = "",
}: StyledCheckboxProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-[#2AAC67] mb-2">
        {label}
      </label>
      <div
        className="w-full h-[50px] min-h-[48px] flex items-center border border-[#2AAC67] rounded-lg px-4"
        style={{
          background: "white",
          color: "#2AAC67",
          fontFamily: "Poppins",
          fontSize: "16px",
        }}
      >
        <Checkbox
          checked={checked}
          onChange={(_, value) => onChange(value)}
          color="success"
          sx={{
            color: "#2AAC67",
            "&.Mui-checked": {
              color: "#2AAC67",
            },
            padding: "0 8px 0 0",
          }}
        />
        <span className="ml-2 font-medium">Activo</span>
      </div>
    </div>
  );
}