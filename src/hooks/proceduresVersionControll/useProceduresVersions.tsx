import { useEffect, useState } from "react";
import { getProceduresVersions } from "../../services/procedures/getProceduresVersions";

export interface ProcedureVersion {
  pdf: string;
  codigo: string;
  version: number;
  responsable: string;
  fecha_vigencia: string;
}

export interface ProcedureRow {
  codigo: string;
  titulo: string;
  departamento: string;
  versiones: ProcedureVersion[];
}

export function useProceduresVersions() {
  const [procedures, setProcedures] = useState<ProcedureRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getProceduresVersions()
      .then((data) => {
        // Mapear la respuesta de la API al formato esperado por la tabla
        setProcedures(
          (data || []).map((item: any) => ({
            // Mostrar el código de la primera versión si existe, si no, dejar vacío
            codigo: item.versiones && item.versiones.length > 0 ? item.versiones[0].codigo : '',
            titulo: item.titulo,
            departamento: item.departamento,
            versiones: (item.versiones || []).map((ver: any) => ({
              pdf: ver.pdf,
              codigo: ver.codigo,
              version: ver.version,
              responsable: ver.responsable,
              fecha_vigencia: ver.fecha_vigencia,
            })),
          }))
        );
      })
      .catch(() => {
        setError("Error al obtener procedimientos");
        setProcedures([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return { procedures, loading, error };
}

