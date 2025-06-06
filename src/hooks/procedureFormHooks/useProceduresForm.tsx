import { useEffect, useState, type ChangeEvent, type FormEvent} from "react";

interface Departamento {
  nombre: string;
  codigo: string;
}

interface Categoria {
  nombre: string;
  codigo: string;
}

interface Poe {
  codigo: string;
  titulo: string;
}

interface FormData {
  titulo: string;
  departamento: string;
  categoria: string;
  poeNumber: string;
  responsable: string;
  revision: string;
  fechaCreacion: string; // <-- Agregado
  fechaVigencia: string; // <-- Agregado
}

export function useProceduresForm() {
  // Datos estáticos igual que en tu vista
  const departamentos: Departamento[] = [
    { nombre: "Ventas", codigo: "700" },
    { nombre: "Producción", codigo: "800" },
    { nombre: "Calidad", codigo: "900" },
    { nombre: "Logística", codigo: "600" },
  ];
  const categorias: Categoria[] = [
    { nombre: "Manual", codigo: "10" },
    { nombre: "Política", codigo: "20" },
    { nombre: "Procedimiento", codigo: "30" },
  ];
  const responsables: string[] = [
    "Juan Pérez",
    "Ana Gómez",
    "Luis Martínez",
    "Marta Díaz",
  ];
  const poees: Poe[] = [
    { codigo: "700-30-0001", titulo: "Ventas de Procedimiento" },
    { codigo: "900-30-0001", titulo: "Calidad de Procedimiento" },
  ];

  // Estado del formulario
  const [formData, setFormData] = useState<FormData>({
    titulo: "",
    departamento: "",
    categoria: "",
    poeNumber: "",
    responsable: "",
    revision: "",
    fechaCreacion: "", // <-- Agregado
    fechaVigencia: "", // <-- Agregado
  });

  const [pdfFile, setPdfFile] = useState<File | null>(null);

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
  }, [formData.departamento, formData.categoria]); // <-- Solo dependencias necesarias

  // Handlers
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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

  // Submit básico
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
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