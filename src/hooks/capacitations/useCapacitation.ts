import { useState, type ChangeEvent, type FormEvent } from "react";

// Datos quemados de ejemplo
const facilitadores = [
  { nombre: "Juan Pérez" },
  { nombre: "Ana Gómez" },
  { nombre: "Luis Martínez" },
  { nombre: "Marta Díaz" },
];

const tiposCapacitacion = [
  { value: "", label: "Seleccione...", disabled: true },
  { value: "Interna", label: "Interna" },
  { value: "Externa", label: "Externa" },
];

const metodosEvaluacion = [
  { value: "", label: "Seleccione...", disabled: true },
  { value: "Teórico", label: "Teórico" },
  { value: "Práctico", label: "Práctico" },
];

const colaboradoresDisponibles = [
  { id: 1, nombre: "Juan Pérez", puesto: "Operador" },
  { id: 2, nombre: "Ana Gómez", puesto: "Supervisor" },
  { id: 3, nombre: "Luis Martínez", puesto: "Analista" },
];

const poesDisponibles = [
  { id: 1, codigo: "700-30-0001", titulo: "POE Ventas" },
  { id: 2, codigo: "900-30-0001", titulo: "POE Calidad" },
];

const columnsColaboradores = [
  { name: "Nombre", selector: (row: any) => row.nombre, sortable: true },
  { name: "Puesto", selector: (row: any) => row.puesto, sortable: true },
];

const columnsPoes = [
  { name: "Código", selector: (row: any) => row.codigo, sortable: true },
  { name: "Título", selector: (row: any) => row.titulo, sortable: true },
];

interface FormData {
  titulo: string;
  tipoCapacitacion: string;
  facilitador: string;
  fecha: string;
  fechaFin: string;
  duracion: string;
  metodoEvaluacion: string;
}

export function useCapacitation() {
  const [showColaboradorModal, setShowColaboradorModal] = useState(false);
  const [showFacilitadorModal, setShowFacilitadorModal] = useState(false);
  const [isEvaluado, setIsEvaluado] = useState(false);
  const [showAsignacionesModal, setShowAsignacionesModal] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    titulo: "",
    tipoCapacitacion: "",
    facilitador: "",
    fecha: "",
    fechaFin: "",
    duracion: "",
    metodoEvaluacion: "",
  });

  // Estado para tablas de selección en el modal
  const [showColaboradoresTable, setShowColaboradoresTable] = useState(false);
  const [showPoesTable, setShowPoesTable] = useState(false);
  const [colaboradoresAsignados, setColaboradoresAsignados] = useState<any[]>(
    []
  );
  const [poesAsignados, setPoesAsignados] = useState<any[]>([]);
  const [selectedColaboradores, setSelectedColaboradores] = useState<any[]>([]);
  const [selectedPoes, setSelectedPoes] = useState<any[]>([]);

  const agregarColaboradores = (seleccionados: any[]) => {
    setColaboradoresAsignados((prev) => [
      ...prev,
      ...seleccionados.filter(
        (c) => !prev.some((asig: any) => asig.id === c.id)
      ),
    ]);
    setShowColaboradoresTable(false);
  };

  const agregarPoes = (seleccionados: any[]) => {
    setPoesAsignados((prev) => [
      ...prev,
      ...seleccionados.filter(
        (p) => !prev.some((asig: any) => asig.id === p.id)
      ),
    ]);
    setShowPoesTable(false);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aquí puedes manejar el submit real
  };

  return {
    showColaboradorModal,
    setShowColaboradorModal,
    showFacilitadorModal,
    setShowFacilitadorModal,
    isEvaluado,
    setIsEvaluado,
    showAsignacionesModal,
    setShowAsignacionesModal,
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    facilitadores,
    tiposCapacitacion,
    metodosEvaluacion,
    colaboradoresDisponibles,
    poesDisponibles,
    columnsColaboradores,
    columnsPoes,
    showColaboradoresTable,
    setShowColaboradoresTable,
    showPoesTable,
    setShowPoesTable,
    colaboradoresAsignados,
    setColaboradoresAsignados,
    poesAsignados,
    setPoesAsignados,
    selectedColaboradores,
    setSelectedColaboradores,
    selectedPoes,
    setSelectedPoes,
    agregarColaboradores,
    agregarPoes,
  };
}
