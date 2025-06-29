import React, { useRef } from "react";
import InputField from "./InputField";
import { showCustomToast } from "../globalComponents/CustomToaster";

interface PdfInputProps {
  label?: string;
  name?: string;
  pdfFile: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  required?: boolean;
  error?: string;
  helperText?: string;
}

const PdfInput: React.FC<PdfInputProps> = ({
  label = "Seleccionar PDF",
  name = "pdfFile",
  pdfFile,
  onChange,
  onRemove,
  required = false,
  error,
  helperText,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Validar que sea un archivo PDF
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith('.pdf')) {
        showCustomToast(
          "Formato de archivo no válido",
          "Por favor, seleccione solo archivos PDF",
          "error"
        );
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }
      
      // Validar tamaño del archivo (máximo 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        showCustomToast(
          "Archivo demasiado grande",
          `El archivo es demasiado grande. Máximo permitido: 10MB. Su archivo: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
          "error"
        );
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      // Mostrar confirmación de éxito
      showCustomToast(
        "Archivo cargado exitosamente",
        `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`,
        "success"
      );
    }
    
    onChange(e);
  };

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
        accept="application/pdf,.pdf"
        onChange={handleFileChange}
        required={required && !pdfFile}
      />
      
      {/* Helper text */}
      <div className="mt-1">
        <p className="text-xs text-gray-600">
          {helperText || (required && !pdfFile ? "Archivo PDF requerido" : "Solo se aceptan archivos PDF (máximo 10MB)")}
        </p>
      </div>
      
      {pdfFile && (
        <div className="flex items-center gap-2 mt-2 p-2 bg-green-50 border border-green-200 rounded">
          <div className="flex-1">
            <p className="text-sm text-green-700 font-medium">
              ✓ Archivo seleccionado: {pdfFile.name}
            </p>
            <p className="text-xs text-green-600">
              Tamaño: {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
          <button
            type="button"
            className="text-red-600 hover:text-red-800 underline text-sm font-medium transition-colors"
            onClick={handleRemove}
          >
            Quitar
          </button>
        </div>
      )}
      {error && (
        <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-600">⚠️ {error}</p>
        </div>
      )}
    </div>
  );
};

export default PdfInput;
