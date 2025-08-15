import { useState, useCallback } from "react";
import { getLastConsecutive } from "../../services/procedures/getLastConsecutive";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

export function useLastConsecutive() {
  const [loading, setLoading] = useState(false);
  const [lastConsecutive, setLastConsecutive] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchLastConsecutive = useCallback(async (prefix: string) => {
    if (!prefix || !prefix.includes('-')) {
      setError("Prefijo inválido");
      setLastConsecutive(null);
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const consecutivoActual = await getLastConsecutive(prefix);
      
      let siguienteConsecutivo: number;
      let mensaje: string;
      
      if (consecutivoActual === null) {
        // Primer procedimiento para esta combinación depto-categoria
        siguienteConsecutivo = 0; // 000
        mensaje = `Primer procedimiento para este prefijo: 000`;
      } else if (typeof consecutivoActual === "number" && consecutivoActual >= 0 && !isNaN(consecutivoActual)) {
        // Ya existe al menos un procedimiento, sumamos 1
        siguienteConsecutivo = consecutivoActual + 1;
        const consecutivoFormateado = String(siguienteConsecutivo).padStart(3, "0");
        mensaje = `El próximo consecutivo será ${consecutivoFormateado}`;
      } else {
        setError("No se pudo obtener el consecutivo");
        setLastConsecutive(null);
        showCustomToast(
          "Error al obtener consecutivo",
          "No se encontró información válida para este prefijo",
          "error"
        );
        return null;
      }
      
      setLastConsecutive(siguienteConsecutivo);
      showCustomToast(
        "Consecutivo obtenido",
        mensaje,
        "success"
      );
      return siguienteConsecutivo;
    } catch (e: any) {
      setError("Error al obtener el consecutivo");
      setLastConsecutive(null);
      
      // Si es un error de conexión u otro error del servidor
      const errorMessage = e.response?.data?.message || "No se pudo conectar con el servidor";
      showCustomToast(
        "Error de conexión",
        errorMessage,
        "error"
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { lastConsecutive, loading, error, fetchLastConsecutive };
}
