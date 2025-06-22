import { useEffect, useState } from "react";
import { getDepartments } from "../../services/manage/departmentService";

export function useDepartments() {
  const [departments, setDepartments] = useState<{
    id_departamento: string;
    nombre: string;
    codigo_departamento: string;
  }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDepartments()
      .then((data) => {
        setDepartments(
          data.map((d: any) => ({
            id_departamento: d.id_departamento?.toString() || "",
            nombre: d.titulo_departamento || d.nombre || d.titulo || "",
            codigo_departamento: d.codigo_departamento?.toString() || d.codigo_departamento || d.codigo || d.id_departamento?.toString() || ""
          }))
        );
      })
      .catch(() => setDepartments([]))
      .finally(() => setLoading(false));
  }, []);

  return { departments, loading };
}
