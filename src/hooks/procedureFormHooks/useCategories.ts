import { useEffect, useState } from "react";
import { getCategories } from "../../services/manage/categorieService";

export function useCategories() {
  const [categories, setCategories] = useState<{ codigo: string; nombre: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then((data) => {
        setCategories(
          data.map((c: any) => ({
            codigo: c.id_categoria?.toString() || "",
            nombre: c.nombre_categoria || c.nombre || "",
          }))
        );
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}
