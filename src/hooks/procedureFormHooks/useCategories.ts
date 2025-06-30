import { useEffect, useState } from "react";
import { getCategories } from "../../services/manage/categoryService";

export function useCategories() {
  const [categories, setCategories] = useState<{
    id_categoria: string;
    nombre: string;
    numero_categoria: string;
  }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then((data) => {
        setCategories(
          data.map((c: any) => ({
            id_categoria: c.id_categoria?.toString() || "",
            nombre: c.nombre_categoria || c.nombre || "",
            numero_categoria: c.numero_categoria?.toString() || "",
          }))
        );
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}
