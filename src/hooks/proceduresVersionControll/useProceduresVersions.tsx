import { useEffect, useState, useCallback } from "react";
import { getProceduresVersions } from "../../services/procedures/getProceduresVersions";

export interface ProcedureVersion {
  titulo: string;
  vigente: number;
  revision: number;
  responsable: string;
  id_documento: number;
  fecha_vigencia: string;
  ruta_documento: string | null;
  version_actual: number;
}

export interface ProcedureRow {
  codigo_poe: string;
  titulo: string;
  fecha_creacion: string;
  id_area: number;
  departamento: string;
  categoria: string;
  versiones: ProcedureVersion[];
}

export function useProceduresVersions() {
  const [procedures, setProcedures] = useState<ProcedureRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProcedures = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getProceduresVersions();
      // Mapear la respuesta de la API al formato esperado por la tabla
      setProcedures(
        (data || []).map((item: any) => ({
          codigo_poe: item.codigo_poe,
          titulo: item.titulo,
          fecha_creacion: item.fecha_creacion,
          id_area: item.id_area,
          departamento: item.departamento,
          categoria: item.categoria,
          versiones: (item.versiones || []).map((ver: any) => ({
            titulo: ver.titulo,
            vigente: ver.vigente,
            revision: ver.revision,
            responsable: ver.responsable,
            id_documento: ver.id_documento,
            fecha_vigencia: ver.fecha_vigencia,
            ruta_documento: ver.ruta_documento,
            version_actual: ver.version_actual,
          })),
        }))
      );
    } catch (error) {
      setError("Error al obtener procedimientos");
      setProcedures([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProcedures();
  }, [fetchProcedures]);

  return { 
    procedures, 
    loading, 
    error, 
    refetch: fetchProcedures 
  };
}

