// src/hooks/listProcedure/useProceduresList.tsx
import { useState, useEffect } from "react";
import { getActiveProcedures, type Procedure } from "../../services/procedures/procedureService";
import api from "../../apiConfig/api";

export function useProceduresList() {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Procedure>("titulo");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [departmentFilter, setDepartmentFilter] = useState<string>("");

  const fetchProcedures = async () => {
    try {
      setLoading(true);
      const data = await getActiveProcedures();
      setProcedures(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar los procedimientos");
      console.error("Error fetching procedures:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const updateProcedure = async (procedureUpdate: {
    id_documento: number;
    descripcion: string;
    id_responsable: number;
    fecha_creacion: string;
    fecha_vigencia: string;
    path: string;
  }) => {
    try {
      const response = await api.put("/procedureList", {
        procedimientos: [{
          id_documento: procedureUpdate.id_documento,
          descripcion: procedureUpdate.descripcion,
          id_responsable: procedureUpdate.id_responsable,
          fecha_creacion: procedureUpdate.fecha_creacion,
          fecha_vigencia: procedureUpdate.fecha_vigencia,
          path: procedureUpdate.path
        }],
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Error al actualizar");
      }

      // Actualizar la lista después de la edición
      await fetchProcedures();
      
      return { 
        success: true, 
        message: "Procedimiento actualizado correctamente" 
      };
    } catch (error: any) {
      console.error("Error updating procedure:", {
        error: error.response?.data || error.message,
        sentData: procedureUpdate
      });
      
      return { 
        success: false, 
        error: error.response?.data?.message || 
              error.message || 
              "Error al comunicarse con el servidor" 
      };
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
    updateProcedure,
    fetchProcedures // Exportar para poder refrescar manualmente
  };
}

export type { Procedure };