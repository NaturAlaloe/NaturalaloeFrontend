//useProceduresForm.tsx
import { useEffect, useState } from "react";

export function useProceduresForm() {
  // Datos estáticos igual que en tu vista
  const departamentos = [
    { nombre: "Ventas", codigo: "700" },
    { nombre: "Producción", codigo: "800" },
    { nombre: "Calidad", codigo: "900" },
    { nombre: "Logística", codigo: "600" },
  ];
  const categorias = [
    { nombre: "Manual", codigo: "10" },
    { nombre: "Política", codigo: "20" },
    { nombre: "Procedimiento", codigo: "30" },
  ];
  const responsables = [
    "Juan Pérez",
    "Ana Gómez",
    "Luis Martínez",
    "Marta Díaz",
  ];
  const poees = [
    { codigo: "700-30-0001", titulo: "Ventas de Procedimiento" },
    { codigo: "900-30-0001", titulo: "Calidad de Procedimiento" },
  ];

  // Estado del formulario
  const [formData, setFormData] = useState({
    titulo: "",
    departamento: "",
    categoria: "",
    poeNumber: "",
    responsable: "",
    revision: "",
    fecha: "",
  });

  const [pdfFile, setPdfFile] = useState(null);

  // Generar poeNumber automáticamente
  useEffect(() => {
    if (formData.departamento && formData.categoria) {
      const dep = departamentos.find(d => d.nombre === formData.departamento);
      const cat = categorias.find(c => c.nombre === formData.categoria);
      // Consecutivo fijo para ejemplo, siempre 0001
      const consecutivo = "0001";
      if (dep && cat) {
        setFormData(prev => ({
          ...prev,
          poeNumber: `${dep.codigo}-${cat.codigo}-${consecutivo}`,
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        poeNumber: "",
      }));
    }
  }, [formData.departamento, formData.categoria]);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Para el PDF
  const handlePdfChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  // Submit básico
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(JSON.stringify(formData, null, 2));
  };

  return {
    formData,
    pdfFile,
    poees,
    departamentos,
    responsables,
    categorias,
    handleChange,
    handlePdfChange,
    handleSubmit,
    setFormData,
    setPdfFile,
  };
}