import { useState, useEffect } from "react";
import { getProceduresActive } from "../../services/procedures/getProceduresService";

export function useSearchProcedures() {
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getProceduresActive()
      .then((data) => {
        setProcedures(data);
        console.log("Procedimientos obtenidos:", data);
      })
      .catch((err) => {
        setError(err);
        console.log("Error al obtener procedimientos:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { procedures, loading, error };
}
