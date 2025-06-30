import { useState, useCallback } from "react";
import { getLastConsecutive } from "../../services/procedures/getLastConsecutive";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

export function useLastConsecutive() {
  const [loading, setLoading] = useState(false);
  const [lastConsecutive, setLastConsecutive] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchLastConsecutive = useCallback(async (prefix: string) => {
    console.log("fetchLastConsecutive llamado con prefijo:", prefix);
    
    if (!prefix || !prefix.includes('-')) {
      console.log("Prefijo inválido:", prefix);
      setError("Prefijo inválido");
      setLastConsecutive(null);
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const consecutivoActual = await getLastConsecutive(prefix);
      console.log("Consecutivo actual recibido en hook:", consecutivoActual);
      
      if (typeof consecutivoActual === "number" && !isNaN(consecutivoActual)) {
        const siguienteConsecutivo = consecutivoActual + 1;
        console.log("Siguiente consecutivo calculado:", siguienteConsecutivo);
        setLastConsecutive(siguienteConsecutivo);
        
        const consecutivoFormateado = String(siguienteConsecutivo).padStart(3, "0");
        const mensaje = consecutivoActual === 1 
          ? `Primer procedimiento para este prefijo: ${consecutivoFormateado}`
          : `El próximo consecutivo será ${consecutivoFormateado}`;
          
        showCustomToast(
          "Consecutivo obtenido",
          mensaje,
          "success"
        );
        return siguienteConsecutivo;
      } else {
        console.log("Consecutivo no válido:", consecutivoActual);
        setError("No se pudo obtener el consecutivo");
        setLastConsecutive(null);
        showCustomToast(
          "Error al obtener consecutivo",
          "No se encontró información para este prefijo",
          "error"
        );
        return null;
      }
    } catch (e) {
      console.error("Error en fetchLastConsecutive:", e);
      setError("Error al obtener el consecutivo");
      setLastConsecutive(null);
      showCustomToast(
        "Error de conexión",
        "No se pudo conectar con el servidor",
        "error"
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { lastConsecutive, loading, error, fetchLastConsecutive };
}
