import React, { useRef } from "react";
import InputField from "./InputField";

interface PdfInputProps {
  label?: string;
  name?: string;
  pdfFile: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  required?: boolean;
}

const PdfInput: React.FC<PdfInputProps> = ({
  label = "Seleccionar PDF",
  name = "pdfFile",
  pdfFile,
  onChange,
  onRemove,
  required = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRemove = () => {
    // Resetear el valor del input file para permitir seleccionar el mismo archivo nuevamente
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onRemove();
  };

  return (
    <div>
      <InputField
        ref={fileInputRef}
        label={label}
        name={name}
        type="file"
        accept="application/pdf"
        onChange={onChange}
        required={required && !pdfFile}
      />
      {pdfFile && (
        <div className="flex items-center gap-2 mt-2">
          <p className="text-sm text-[#2AAC67] font-medium">
            Archivo seleccionado: {pdfFile.name}
          </p>
          <button
            type="button"
            className="text-red-600 underline text-xs"
            onClick={handleRemove}
          >
            Quitar
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfInput;
