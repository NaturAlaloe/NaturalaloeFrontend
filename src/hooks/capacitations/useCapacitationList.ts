import { useState } from "react";
import { useNavigate } from "react-router-dom";

export interface Capacitation {
  id: string;
  poe: string;
  titulo: string;
  duracion: number;
  fechaInicio: string;
  fechaFinal: string;
  comentario: string;
  tipo: string;
  evaluado: string;
  metodo: string;
  seguimiento: string;
  estado: string;
  colaborador: {
    nombreCompleto: string;
    cedula: string;
    correo: string;
    telefono: string;
    area: string;
    departamento: string;
    puesto: string;
  };
  profesor: {
    nombre: string;
    apellido: string;
    identificacion: string;
  };
}

export function useCapacitationList() {
  const initialCapacitations: Capacitation[] = [
    {
      id: "001",
      poe: "POE-001",
      titulo: "Inducción a la empresa",
      duracion: 8,
      tipo: "Individual",
      fechaInicio: "2024-06-01",
      fechaFinal: "2024-06-05",
      comentario: "Inducción general para nuevos colaboradores.",
      evaluado: "Sí",
      metodo: "Teórico",
      seguimiento: "Reprogramar",
      estado: "Finalizado",
      colaborador: {
        nombreCompleto: "Juan Pérez",
        cedula: "123456789",
        correo: "juan.perez@email.com",
        telefono: "555-1234",
        area: "Producción",
        departamento: "Operaciones",
        puesto: "Operador",
      },
      profesor: {
        nombre: "Ana",
        apellido: "García",
        identificacion: "987654321",
      },
    },
    {
      id: "002",
      poe: "POE-002",
      titulo: "Capacitación en seguridad",
      duracion: 6,
      tipo: "Individual",
      fechaInicio: "2024-06-10",
      fechaFinal: "2024-06-12",
      comentario:
        "Capacitación en seguridad industrial y protocolos de emergencia.",
      evaluado: "No",
      metodo: "Práctico",
      seguimiento: "Satisfactorio",
      estado: "Pendiente",
      colaborador: {
        nombreCompleto: "María López",
        cedula: "987654321",
        correo: "maria.lopez@email.com",
        telefono: "555-5678",
        area: "Calidad",
        departamento: "Control",
        puesto: "Supervisora",
      },
      profesor: {
        nombre: "Carlos",
        apellido: "Ramírez",
        identificacion: "123123123",
      },
    },
    {
      id: "003",
      poe: "POE-003",
      titulo: "Actualización de procesos",
      duracion: 4,
      tipo: "Grupal",
      fechaInicio: "2024-07-01",
      fechaFinal: "2024-07-03",
      comentario: "Actualización de procesos internos y mejores prácticas.",
      evaluado: "Sí",
      metodo: "Mixto",
      seguimiento: "Reevaluación",
      estado: "Finalizado",
      colaborador: {
        nombreCompleto: "Pedro Sánchez",
        cedula: "456789123",
        correo: "pedro.sanchez@email.com",
        telefono: "555-8765",
        area: "Logística",
        departamento: "Almacén",
        puesto: "Encargado",
      },
      profesor: {
        nombre: "Lucía",
        apellido: "Fernández",
        identificacion: "321321321",
      },
    },
  ];

  const [capacitations] = useState<Capacitation[]>(initialCapacitations);
  const [searchTerm, setSearchTerm] = useState("");
  const [poeFilter, setPoeFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [tipoFilter, setTipoFilter] = useState("");
  const [seguimientoFilter, setSeguimientoFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [rowsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedCapacitation, setSelectedCapacitation] =
    useState<Capacitation | null>(null);
  const navigate = useNavigate();

  const poes = Array.from(new Set(capacitations.map((c) => c.poe)));
  const estados = Array.from(new Set(capacitations.map((c) => c.estado)));
  const tipos = Array.from(new Set(capacitations.map((c) => c.tipo)));
  const seguimientos = Array.from(
    new Set(capacitations.map((c) => c.seguimiento))
  );

  const filteredCapacitations = capacitations.filter((cap) => {
    const matchesSearch =
      cap.poe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cap.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cap.seguimiento.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPoe = !poeFilter || cap.poe === poeFilter;
    const matchesEstado = !estadoFilter || cap.estado === estadoFilter;
    const matchesSeguimiento =
      !seguimientoFilter || cap.seguimiento === seguimientoFilter;
    const matchesTipo = !tipoFilter || cap.tipo === tipoFilter;
    return (
      matchesSearch &&
      matchesPoe &&
      matchesEstado &&
      matchesSeguimiento &&
      matchesTipo
    );
  });

  const navegarCapacitacionFinalizada = () => {
    navigate("/capacitation/capacitationFinished");
  };

  const paginatedCapacitations = filteredCapacitations.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(filteredCapacitations.length / rowsPerPage);

  const handleRowClick = (cap: Capacitation) => {
    setSelectedCapacitation(cap);
    setShowModal(true);
  };
  return {
    capacitations: paginatedCapacitations,
    searchTerm,
    setSearchTerm,
    poeFilter,
    setPoeFilter,
    estadoFilter,
    setEstadoFilter,
    tipoFilter,
    setTipoFilter,
    seguimientoFilter,
    setSeguimientoFilter,
    poes,
    estados,
    tipos,
    seguimientos,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    totalPages,
    showModal,
    setShowModal,
    navegarCapacitacionFinalizada,
    selectedCapacitation,
    setSelectedCapacitation,
    handleRowClick,
    totalCount: filteredCapacitations.length,
  };
}
