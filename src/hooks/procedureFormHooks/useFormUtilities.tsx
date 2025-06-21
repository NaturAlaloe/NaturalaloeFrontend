import { useState, type ChangeEvent } from "react";

interface FormData {
  titulo: string;
  area: string;
  departamento: string;
  categoria: string;
  responsable: string;
  revision: string;
  fechaCreacion: string;
  fechaVigencia: string;
}

export function useProceduresForm() {
  // Estado del formulario
  const [formData, setFormData] = useState<FormData>({
    titulo: "",
    area: "",
    departamento: "",
    categoria: "",
    responsable: "",
    revision: "",
    fechaCreacion: "",
    fechaVigencia: "",
  });

  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // Handlers
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Para el PDF
  const handlePdfChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  return {
    formData,
    pdfFile,
    handleChange,
    handlePdfChange,
    setFormData,
    setPdfFile,
  };
}