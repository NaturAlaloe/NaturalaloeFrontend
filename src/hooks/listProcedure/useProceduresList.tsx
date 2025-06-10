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
      departamento: "Recursos Humanos",
      responsable: "Juan Pérez",
      revision: 3,
      fecha: "2023-05-15",
    },
    {
      poe: "800-30-0001",
      titulo: "Protocolo de mantenimiento de servidores",
      departamento: "Tecnología",
      responsable: "María Gómez",
      revision: 5,
      fecha: "2023-06-20",
    },
    {
      poe: "600-30-0001",
      titulo: "Proceso de facturación electrónica",
      departamento: "Contabilidad",
      responsable: "Carlos Ruiz",
      revision: 2,
      fecha: "2023-04-10",
    },
    {
      poe: "900-30-0001",
      titulo: "Normas de control de calidad",
      departamento: "Aseguramiento",
      responsable: "Ana López",
      revision: 4,
      fecha: "2023-07-05",
    },
    {
      poe: "800-20-0001",
      titulo: "Manual operativo estándar",
      departamento: "Producción",
      responsable: "Luis Martínez",
      revision: 1,
      fecha: "2023-03-25",
    },
    {
      poe: "900-30-0002",
      titulo: "Reglamento de selección de personal",
      departamento: "Talento Humano",
      responsable: "Pedro Sánchez",
      revision: 3,
      fecha: "2023-05-18",
    },
    {
      poe: "1000-30-0001",
      titulo: "Directriz de respaldo de datos",
      departamento: "Sistemas",
      responsable: "Laura Díaz",
      revision: 5,
      fecha: "2023-06-22",
    },
    {
      poe: "1100-30-0001",
      titulo: "Flujo de cuentas por cobrar",
      departamento: "Finanzas",
      responsable: "Roberto Vega",
      revision: 2,
      fecha: "2023-04-12",
    },
    {
      poe: "1200-30-0001",
      titulo: "Procedimiento de auditoría interna",
      departamento: "Calidad Total",
      responsable: "Sofía Castro",
      revision: 4,
      fecha: "2023-07-08",
    },
    {
      poe: "1300-20-0001",
      titulo: "Guía de seguridad industrial",
      departamento: "Logística",
      responsable: "Diego Ramírez",
      revision: 1,
      fecha: "2023-03-28",
    },
    {
      poe: "1400-30-0001",
      titulo: "Política de capacitación",
      departamento: "Desarrollo Organizacional",
      responsable: "Elena Mendoza",
      revision: 3,
      fecha: "2023-05-20",
    },
    {
      poe: "1500-30-0001",
      titulo: "Protocolo de ciberseguridad",
      departamento: "Infraestructura IT",
      responsable: "Jorge Herrera",
      revision: 5,
      fecha: "2023-06-25",
    },
    {
      poe: "1600-30-0001",
      titulo: "Normativa de gastos corporativos",
      departamento: "Tesorería",
      responsable: "Patricia Navarro",
      revision: 2,
      fecha: "2023-04-15",
    },
    {
      poe: "1700-30-0001",
      titulo: "Manual de buenas prácticas",
      departamento: "Gestión de Calidad",
      responsable: "Fernando Ortega",
      revision: 4,
      fecha: "2023-07-10",
    },
    {
      poe: "1800-20-0001",
      titulo: "Proceso de cadena de suministro",
      departamento: "Operaciones Globales",
      responsable: "Gabriela Silva",
      revision: 1,
      fecha: "2023-03-30",
    },
    {
      poe: "1900-30-0001",
      titulo: "Regulación de beneficios",
      departamento: "Compensaciones",
      responsable: "Ricardo Paredes",
      revision: 3,
      fecha: "2023-05-25",
    },
    {
      poe: "2000-30-0001",
      titulo: "Estrategia de recuperación de desastres",
      departamento: "TI Corporativo",
      responsable: "Adriana Ríos",
      revision: 5,
      fecha: "2023-06-30",
    },
    {
      poe: "2100-30-0001",
      titulo: "Proceso de conciliación bancaria",
      departamento: "Contraloría",
      responsable: "Oscar Méndez",
      revision: 2,
      fecha: "2023-04-18",
    },
    {
      poe: "2200-30-0001",
      titulo: "Estándares de pruebas de producto",
      departamento: "Aseguramiento de Calidad",
      responsable: "Lucía Fernández",
      revision: 4,
      fecha: "2023-07-15",
    },
    {
      poe: "2300-20-0001",
      titulo: "Protocolo de empaque y envío",
      departamento: "Distribución",
      responsable: "Héctor Guzmán",
      revision: 1,
      fecha: "2023-04-05",
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