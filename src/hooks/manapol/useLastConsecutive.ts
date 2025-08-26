import { useState, useEffect } from "react";
import { getManapoolLastConsecutive } from "../../services/manapol/manapolService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

export function useLastConsecutive() {
  const [consecutivo, setConsecutivo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConsecutive = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const nuevoConsecutivo = await getManapoolLastConsecutive();
      setConsecutivo(nuevoConsecutivo);
      return nuevoConsecutivo;
    } catch (error: any) {
      const errorMessage = error.message || "No se pudo obtener el código consecutivo";
      setError(errorMessage);
      console.error("Error al obtener consecutivo:", error);
      
      // Mostrar toast de error
      showCustomToast(
        "Error",
        errorMessage,
        "error"
      );
      
      throw error; // Re-lanzar para que el componente pueda manejarlo si es necesario
    } finally {
      setLoading(false);
    }
  };

  // Cargar consecutivo automáticamente al montar el hook
  useEffect(() => {
    fetchConsecutive();
  }, []);

  // Función para refrescar el consecutivo manualmente
  const refreshConsecutive = () => {
    return fetchConsecutive();
  };

  return {
    consecutivo,
    loading,
    error,
    refreshConsecutive,
  };
}
