import { useEffect, useState } from "react";
import { getDepartments } from "../../services/manage/departmentService";

export function useDepartments() {
  const [departments, setDepartments] = useState<{ codigo: string; nombre: string; codigo_departamento: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDepartments()
      .then((data) => {
        setDepartments(
          data.map((d: any) => ({
            codigo: d.id_departamento?.toString() || d.id || d.codigo || d.codigo_departamento || "",
            nombre: d.nombre || d.titulo || d.titulo_departamento || "",
            codigo_departamento: d.codigo_departamento?.toString() || d.codigo_departamento || d.codigo || d.id_departamento?.toString() || ""
          }))
        );
      })
      .catch(() => setDepartments([]))
      .finally(() => setLoading(false));
  }, []);

  return { departments, loading };
}
