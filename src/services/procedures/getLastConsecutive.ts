import api from "../../apiConfig/api";

export async function getLastConsecutive(prefix: string) {
  try {
    console.log("Llamando a API con prefijo:", prefix);
    const response = await api.get(`/procedure/${prefix}`);
    console.log("Respuesta completa de la API:", response.data);
    
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      // Si el array está vacío, es el primer procedimiento para este prefijo
      if (response.data.data.length === 0) {
        console.log("No hay procedimientos previos para este prefijo, asignando 001");
        return 0; // Retornamos 0, que se mostrará como 001 después del padding
      }
      
      // Si hay datos, obtenemos el consecutivo actual
      if (response.data.data.length > 0) {
        const consecutivoActual = response.data.data[0].consecutivo_actual;
        console.log("Consecutivo actual obtenido:", consecutivoActual);
        
        if (consecutivoActual !== undefined && consecutivoActual !== null) {
          const numeroConsecutivo = Number(consecutivoActual);
          console.log("Consecutivo convertido a número:", numeroConsecutivo);
          return numeroConsecutivo;
        }
      }
    }
    
    console.log("No se encontró consecutivo válido en la respuesta");
    return null;
  } catch (error) {
    console.error("Error al obtener consecutivo:", error);
    return null;
  }
}