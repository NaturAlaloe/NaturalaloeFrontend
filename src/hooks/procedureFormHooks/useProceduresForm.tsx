import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

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
    { nombre: "ACTIVOS, PASIVO Y CAPITAL", codigo: "1" },
    { nombre: "EDIFICIOS E INSTALACIONES", codigo: "2" },
    { nombre: "MANEJO DE EFECTIVO", codigo: "3" },
    { nombre: "SERVICIOS DE LA COMPAÑÍA", codigo: "4" },
    { nombre: "COMPENSACION", codigo: "5" },
    { nombre: "CONSULTORES", codigo: "6" },
    { nombre: "DISTRIBUCION", codigo: "7" },
    { nombre: "EMPLEO 1 CONTRATACION", codigo: "8" },
    { nombre: "MANEJO FINANCIERO", codigo: "9" },
    { nombre: "EXPORTACIONES", codigo: "10" },
    {
      nombre: "CONTROL DE EMPAQUE, ETIQUETADO, COMPONENTES, CONTENEDORES Y CIERRES",
      codigo: "11",
    },
    { nombre: "CONTABILIDAD GENERAL", codigo: "12" },
    { nombre: "INFORMACION DE SERVICIOS", codigo: "13" },
    { nombre: "ETIQUETADO Y LITERATURA PROMOCIONAL", codigo: "14" },
    { nombre: "CONTROLES DE LABORATORIOS", codigo: "15" },
    { nombre: "EQUIPO 1 CALIBRACION", codigo: "16" },
    { nombre: "METODOS 1 MISCELANEOS", codigo: "17" },
    { nombre: "PLANILLA", codigo: "18" },
    { nombre: "EVALUACION DE DESEMPEÑO", codigo: "19" },
    { nombre: "DESARROLLO DE PROCESOS", codigo: "20" },
    { nombre: "AUDITORIAS (INTERNAS & Edemas", codigo: "21" },
    { nombre: "ESTANDARES DE CONDUCTA", codigo: "22" },
    { nombre: "APOYO", codigo: "23" },
    { nombre: "DIRECCION 1 GENERAL", codigo: "24" },
    { nombre: "LIMPIEZA & DESINFECCIÓN", codigo: "25" },
    { nombre: "PRODUCTOS TERMINADOS", codigo: "26" },
    { nombre: "METODOS, QUIMICA", codigo: "27" },
    { nombre: "METODOS, MICROBIOLOGIA", codigo: "28" },
    { nombre: "VALIDACION", codigo: "29" },
    { nombre: "CERTIFICADOS 1 LICENCIAS", codigo: "30" },
    { nombre: "OPERACIONES", codigo: "31" },
    { nombre: "FINCA", codigo: "32" },
    { nombre: "PERSONAL 1 CAPACITACIONES", codigo: "36" },
    { nombre: "PROCESOS DE INGENIERA", codigo: "40" },
    {
      nombre: "CONTROL DE PROCESO Y PRODUCCION(FORMULACION Y EMPAQU",
      codigo: "43",
    },
    { nombre: "COMPRAS", codigo: "45" },
    { nombre: "REGISTROS", codigo: "46" },
    { nombre: "ASUNTOS REGULATORIOS", codigo: "47" },
    { nombre: "DEVOLUCIONES 1 ANULACIONES 1 QUEJAS", codigo: "49" },
    { nombre: "SEGURIDAD 1 AMBIENTE", codigo: "50" },
    { nombre: "MUESTREO/MANEJO DE MUESTRAS", codigo: "51" },
    { nombre: "ESPECIFICACIONES PARA PRODUCTO FINAL", codigo: "53" },
    { nombre: "ESPECIFICACIONES PARA MATERIA PRIMA", codigo: "54" },
    { nombre: "ALMACENAMIENTO", codigo: "60" },
    { nombre: "INSPECCION", codigo: "61" },
    { nombre: "APROBACION 1 RECHAZO", codigo: "63" },
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
      const dep = departamentos.find((d) => d.nombre === formData.departamento);
      const cat = categorias.find((c) => c.nombre === formData.categoria);
      // Consecutivo fijo para ejemplo, siempre 0001
      const consecutivo = "0001";
      if (dep && cat) {
        setFormData((prev) => ({
          ...prev,
          poeNumber: `${dep.codigo}-${cat.codigo}-${consecutivo}`,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        poeNumber: "",
      }));
    }
  }, [formData.departamento, formData.categoria]); // <-- Solo dependencias necesarias

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
