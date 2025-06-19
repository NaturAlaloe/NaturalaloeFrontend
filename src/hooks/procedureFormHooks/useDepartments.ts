import { useEffect, useState } from "react";
import { getDepartments } from "../../services/manage/departmentService";

export function useDepartments() {
  const [departments, setDepartments] = useState<{ codigo: string; nombre: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDepartments()
      .then((data) => {
        setDepartments(
          data.map((d: any) => ({
            codigo: d.id_departamento?.toString() || d.id || d.codigo || d.codigo_departamento || "",
            nombre: d.nombre || d.titulo || d.titulo_departamento || "",
          }))
        );
      })
      .catch(() => setDepartments([]))
      .finally(() => setLoading(false));
  }, []);

  return { departments, loading };
}
