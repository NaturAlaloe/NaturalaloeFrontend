import { useEffect, useState } from "react";
import { getAreas } from "../../services/manage/areaService";

export function useAreas() {
  const [areas, setAreas] = useState<{
    id_area: string;
    nombre: string;
    codigo: string;
  }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAreas()
      .then((data) => {
        setAreas(
          data.map((a: any) => ({
            id_area: a.id_area?.toString() || a.id || a.codigo || a.codigo_area || "",
            nombre: a.nombre || a.titulo || a.titulo_area || "",
            codigo: a.codigo_area?.toString() || a.codigo || a.id_area?.toString() || ""
          }))
        );
      })
      .catch(() => setAreas([]))
      .finally(() => setLoading(false));
  }, []);

  return { areas, loading };
}
