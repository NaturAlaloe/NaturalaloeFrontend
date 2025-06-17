// src/hooks/listProcedure/useProceduresList.tsx
import { useState, useEffect } from "react";
import { getActiveProcedures, type Procedure } from "../../services/procedures/procedureService";

export function useProceduresList() {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Procedure>("titulo");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [departmentFilter, setDepartmentFilter] = useState<string>("");

  useEffect(() => {
    const fetchProcedures = async () => {
      try {
        const data = await getActiveProcedures();
        setProcedures(data);
      } catch (err) {
        setError("Error de conexión con el servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchProcedures();
  }, []);

  const filteredProcedures = procedures.filter((procedure) => {
    const matchesSearch =
      procedure.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      procedure.revision.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (procedure.id_poe && procedure.id_poe.toString().includes(searchTerm));
    const matchesDepartment =
      !departmentFilter || procedure.departamento === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  const sortedProcedures = [...filteredProcedures].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortDirection === "asc" ? 1 : -1;
    if (bValue == null) return sortDirection === "asc" ? -1 : 1;

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const departments = Array.from(
    new Set(procedures.map((p) => p.departamento))
  );

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
    loading,
    error,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    handleSort,
    departmentFilter,
    setDepartmentFilter,
    departments,
  };
}

export { Procedure };
