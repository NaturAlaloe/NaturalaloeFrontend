import { useState } from "react";
import { useNavigate } from "react-router-dom";

export interface CapacitationGeneral {
  id: string;
  titulo: string;
  fechaCreacion: string;
  estado: string;
  comentario: string;
  colaboradoresAsignados: number;
  colaboradores: {
    id: number;
    nombre: string;
    puesto: string;
    departamento: string;
    cedula: string;
  }[];
}

export function useCapacitationGeneralList() {
  // Datos de ejemplo para capacitaciones generales
  const initialCapacitations: CapacitationGeneral[] = [
    {
      id: "GEN-001",
      titulo: "Capacitación General de Seguridad Industrial",
      fechaCreacion: "2024-06-01",
      estado: "Activo",
      comentario: "Capacitación general sobre normas de seguridad para todos los empleados.",
      colaboradoresAsignados: 15,
      colaboradores: [
        { id: 1, nombre: "Juan Pérez", puesto: "Operador", departamento: "Producción", cedula: "123456789" },
        { id: 2, nombre: "Ana Gómez", puesto: "Supervisora", departamento: "Calidad", cedula: "987654321" },
        { id: 3, nombre: "Carlos Ramírez", puesto: "Técnico", departamento: "Mantenimiento", cedula: "456789123" },
      ],
    },
    {
      id: "GEN-002", 
      titulo: "Inducción Corporativa",
      fechaCreacion: "2024-06-15",
      estado: "Pendiente",
      comentario: "Inducción general para nuevos colaboradores sobre la cultura empresarial.",
      colaboradoresAsignados: 8,
      colaboradores: [
        { id: 4, nombre: "María López", puesto: "Analista", departamento: "Administración", cedula: "789123456" },
        { id: 5, nombre: "Pedro Sánchez", puesto: "Contador", departamento: "Finanzas", cedula: "321654987" },
      ],
    },
    {
      id: "GEN-003",
      titulo: "Actualización de Políticas Internas",
      fechaCreacion: "2024-07-01",
      estado: "Finalizado",
      comentario: "Capacitación sobre las nuevas políticas internas de la empresa.",
      colaboradoresAsignados: 25,
      colaboradores: [
        { id: 6, nombre: "Laura Rodríguez", puesto: "Jefe de Área", departamento: "Recursos Humanos", cedula: "654987321" },
        { id: 7, nombre: "Miguel Torres", puesto: "Coordinador", departamento: "Logística", cedula: "147258369" },
      ],
    },
  ];

  const [capacitations] = useState<CapacitationGeneral[]>(initialCapacitations);
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [rowsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedCapacitation, setSelectedCapacitation] = useState<CapacitationGeneral | null>(null);
  const navigate = useNavigate();

  // Filtros únicos
  const estados = Array.from(new Set(capacitations.map((c) => c.estado)));

  // Filtrar por búsqueda y filtros
  const filteredCapacitations = capacitations.filter((cap) => {
    const matchesSearch =
      cap.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cap.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cap.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = !estadoFilter || cap.estado === estadoFilter;
    
    return matchesSearch && matchesEstado;
  });

  // Paginación
  const paginatedCapacitations = filteredCapacitations.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(filteredCapacitations.length / rowsPerPage);

  // Acciones
  const handleRowClick = (cap: CapacitationGeneral) => {
    setSelectedCapacitation(cap);
    setShowModal(true);
  };

  const navegarCapacitacionGeneral = () => {
    navigate("/capacitation/capacitacion");
  };

  return {
    capacitations: paginatedCapacitations,
    searchTerm,
    setSearchTerm,
    estadoFilter,
    setEstadoFilter,
    estados,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    totalPages,
    showModal,
    setShowModal,
    selectedCapacitation,
    setSelectedCapacitation,
    handleRowClick,
    navegarCapacitacionGeneral,
    totalCount: filteredCapacitations.length,
  };
}
