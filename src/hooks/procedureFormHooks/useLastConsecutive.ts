import { useState, useCallback } from "react";
import { getLastConsecutive } from "../../services/procedures/getLastConsecutive";

export function useLastConsecutive() {
  const [loading, setLoading] = useState(false);
  const [lastConsecutive, setLastConsecutive] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchLastConsecutive = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const last = await getLastConsecutive();
      if (typeof last === "number") {
        setLastConsecutive(last);
        return last;
      } else {
        setError("Respuesta inesperada de la API");
        setLastConsecutive(null);
        return null;
      }
    } catch (e) {
      setError("Error al obtener el consecutivo");
      setLastConsecutive(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { lastConsecutive, loading, error, fetchLastConsecutive };
}
