// src/hooks/procedureFormHooks/useProceduresList.tsx

import { useState } from "react";


export interface Procedure {
  poe: string;
  titulo: string;
  departamento: string;
  responsable: string;
  revision: number;
  fecha: string;
}

export function useProceduresList() {
  // Datos de ejemplo basados en la imagen
  const initialProcedures: Procedure[] = [
    {
      poe: "700-30-0001",
      titulo: "Procedimiento de contratación",
      departamento: "RH",
      responsable: "Juan Pérez",
      revision: 3,
      fecha: "2023-05-15",
    },
    {
      poe: "800-30-0001",
      titulo: "Mantenimiento de servidores",
      departamento: "TI",
      responsable: "María Gómez",
      revision: 5,
      fecha: "2023-06-20",
    },
    {
      poe: "600-30-0001",
      titulo: "Proceso de facturación",
      departamento: "Finanzas",
      responsable: "Carlos Ruiz",
      revision: 2,
      fecha: "2023-04-10",
    },
    {
      poe: "900-30-0001",
      titulo: "Control de calidad",
      departamento: "Calidad",
      responsable: "Ana López",
      revision: 4,
      fecha: "2023-07-05",
    },
    {
      poe: "800-20-0001",
      titulo: "Procedimiento operativo estándar",
      departamento: "Operaciones",
      responsable: "Luis Martínez",
      revision: 1,
      fecha: "2023-03-25",
    },
  ];

  const [procedures, setProcedures] = useState<Procedure[]>(initialProcedures);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Procedure>("poe");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [responsibleFilter, setResponsibleFilter] = useState<string>("");

  // Filtrar procedimientos
  const filteredProcedures = procedures.filter((procedure) => {
    const matchesSearch = procedure.poe.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         procedure.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !departmentFilter || procedure.departamento === departmentFilter;
    const matchesResponsible = !responsibleFilter || procedure.responsable === responsibleFilter;
    
    return matchesSearch && matchesDepartment && matchesResponsible;
  });

  // Ordenar procedimientos
  const sortedProcedures = [...filteredProcedures].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Obtener departamentos únicos para filtros
  const departments = Array.from(new Set(procedures.map(p => p.departamento)));
  
  // Obtener responsables únicos para filtros
  const responsibles = Array.from(new Set(procedures.map(p => p.responsable)));

  // Función para cambiar el ordenamiento
  const handleSort = (field: keyof Procedure) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return {
    procedures: sortedProcedures,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    handleSort,
    departmentFilter,
    setDepartmentFilter,
    responsibleFilter,
    setResponsibleFilter,
    departments,
    responsibles,
  };
}