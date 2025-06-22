import { useState, useCallback } from "react";
import { getLastConsecutive } from "../../services/procedures/getLastConsecutive";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

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
        setLastConsecutive(last+1);
        showCustomToast(
          "Consecutivo obtenido",
          `El consecutivo es ${last + 1}`,
          "success"
        );
        return last;
      } else {
        setError("Respuesta inesperada de la API");
        setLastConsecutive(null);
        showCustomToast(
          "No se pudo obtener el consecutivo",
          "Respuesta inesperada de la API",
          "error"
        );
        return null;
      }
    } catch (e) {
      setError("Error al obtener el consecutivo");
      setLastConsecutive(null);
      showCustomToast(
        "No se pudo obtener el consecutivo",
        "Error de conexión o servidor",
        "error"
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { lastConsecutive, loading, error, fetchLastConsecutive };
}
