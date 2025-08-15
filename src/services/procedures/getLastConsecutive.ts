import api from "../../apiConfig/api";

export async function getLastConsecutive(prefix: string) {
  try {
    const response = await api.get(`/procedure/${prefix}`);
    
    if (response.data && response.data.success) {
      // Verificar si data es un array
      if (Array.isArray(response.data.data)) {
        // Si el array está vacío, es el primer procedimiento
        if (response.data.data.length === 0) {
          return null;
        }
        
        // Si hay elementos en el array, tomar el primero
        if (response.data.data.length > 0 && response.data.data[0].consecutivo_actual !== undefined) {
          const consecutivoActual = response.data.data[0].consecutivo_actual;
          
          // Convertir a número, manejando tanto strings como números
          const numeroConsecutivo = typeof consecutivoActual === 'string' 
            ? parseInt(consecutivoActual, 10) 
            : Number(consecutivoActual);
          
          // Verificar que es un número válido
          if (!isNaN(numeroConsecutivo) && numeroConsecutivo >= 0) {
            return numeroConsecutivo;
          } else {
            return null;
          }
        }
      } else if (response.data.data && response.data.data.consecutivo_actual !== undefined) {
        // Caso donde data es un objeto directo (fallback por si cambia la API)
        const consecutivoActual = response.data.data.consecutivo_actual;
        
        // Convertir a número, manejando tanto strings como números
        const numeroConsecutivo = typeof consecutivoActual === 'string' 
          ? parseInt(consecutivoActual, 10) 
          : Number(consecutivoActual);
        
        // Verificar que es un número válido
        if (!isNaN(numeroConsecutivo) && numeroConsecutivo >= 0) {
          return numeroConsecutivo;
        } else {
          return null;
        }
      }
    }
    
    return null; // null indica que es el primer procedimiento (consecutivo 000)
  } catch (error: any) {
    // Si es un 404 o error similar, significa que no existe el prefijo (primer procedimiento)
    if (error.response && error.response.status === 404) {
      return null; // null indica que es el primer procedimiento (consecutivo 000)
    }
    
    throw error; // Re-lanzamos otros errores
  }
}