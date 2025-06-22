import { useState } from "react";

export interface CapacitationGeneral {
  id: string;
  titulo: string;
  estado: string;
  fechaCreacion: string;
  colaboradores: {
    id: number;
    nombre: string;
    puesto: string;
    departamento: string;
    cedula: string;
  }[];
}
export function useCapacitationGeneralList() {
  const initialCapacitations: CapacitationGeneral[] = [
    {
      id: "GEN-001",
      titulo: "Capacitación General de Seguridad Industrial",
      estado: "Finalizado",
      fechaCreacion: "2023-10-01",
      colaboradores: [
        {
          id: 1,
          nombre: "Juan Pérez",
          puesto: "Operador",
          departamento: "Producción",
          cedula: "123456789",
        },
        {
          id: 2,
          nombre: "Ana Gómez",
          puesto: "Supervisora",
          departamento: "Calidad",
          cedula: "987654321",
        },
        {
          id: 3,
          nombre: "Carlos Ramírez",
          puesto: "Técnico",
          departamento: "Mantenimiento",
          cedula: "456789123",
        },
      ],
    },
    {
      id: "GEN-002",
      titulo: "Inducción Corporativa",
      estado: "Pendiente",
      fechaCreacion: "2023-10-05",
      colaboradores: [
        {
          id: 4,
          nombre: "María López",
          puesto: "Analista",
          departamento: "Administración",
          cedula: "789123456",
        },
        {
          id: 5,
          nombre: "Pedro Sánchez",
          puesto: "Contador",
          departamento: "Finanzas",
          cedula: "321654987",
        },
      ],
    },
    {
      id: "GEN-003",
      titulo: "Actualización de Políticas Internas",

      estado: "Finalizado",
      fechaCreacion: "2023-10-10",
      colaboradores: [
        {
          id: 6,
          nombre: "Laura Rodríguez",
          puesto: "Jefe de Área",
          departamento: "Recursos Humanos",
          cedula: "654987321",
        },
        {
          id: 7,
          nombre: "Miguel Torres",
          puesto: "Coordinador",
          departamento: "Logística",
          cedula: "147258369",
        },
      ],
    },
  ];

  const [capacitations] = useState<CapacitationGeneral[]>(initialCapacitations);
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedCapacitation, setSelectedCapacitation] =
    useState<CapacitationGeneral | null>(null);
  const estados = Array.from(new Set(capacitations.map((c) => c.estado)));

  const filteredCapacitations = capacitations.filter((cap) => {
    const matchesSearch =
      cap.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cap.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cap.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = !estadoFilter || cap.estado === estadoFilter;

    return matchesSearch && matchesEstado;
  });

  const paginatedCapacitations = filteredCapacitations.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(filteredCapacitations.length / rowsPerPage);

  const handleRowClick = (cap: CapacitationGeneral) => {
    setSelectedCapacitation(cap);
    setShowModal(true);
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
    totalCount: filteredCapacitations.length,
  };
}
