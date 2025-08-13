import api from "../../apiConfig/api";

export async function increaseVersion(data: {
  codigo: string;
  descripcion: string;
  id_responsable: number;
  nueva_version: number;
  fecha_creacion: string;
  fecha_vigencia: string;
  vigente: number;
  documento?: File;
}) {
  try {
    const formData = new FormData();

    // Agregar todos los campos requeridos al FormData según la documentación de la API
    formData.append("codigo", data.codigo);
    formData.append("descripcion", data.descripcion);
    formData.append("id_responsable", data.id_responsable.toString());
    formData.append("nueva_version", data.nueva_version.toString());
    formData.append("fecha_creacion", data.fecha_creacion);
    formData.append("fecha_vigencia", data.fecha_vigencia);
    formData.append("vigente", data.vigente.toString());
    
    // Agregar documento PDF si se proporciona (es opcional según la API)
    if (data.documento) {
      formData.append("documento", data.documento);
    }

    const response = await api.put("/procedures/increase", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return response.data;
  } catch (error: any) {
    console.error("Error al incrementar versión del POE:", error);
    
    // Manejo específico de errores según el código de respuesta HTTP
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message;
      
      switch (status) {
        case 400:
          throw new Error(message || "Petición inválida: verificar que todos los campos obligatorios estén completos (código, descripción, id_responsable, nueva_version, fecha_creación, fecha_vigencia y vigente)");
        
        case 401:
          throw new Error("Token de autenticación requerido. Inicia sesión nuevamente.");
        
        case 403:
          throw new Error("No tienes permisos suficientes para crear nuevas versiones de POE.");
        
        case 404:
          throw new Error(message || "El código POE especificado no existe. Verifica que el código sea correcto.");
        
        case 409:
          throw new Error(message || "Conflicto al crear nueva versión: posible duplicación de versión o problemas de vigencia");
        
        case 422:
          throw new Error(message || "Datos de entrada no válidos: verifica que las fechas estén en formato correcto y los campos numéricos sean válidos");
        
        case 500:
          throw new Error(message || "Error interno del servidor al incrementar la versión del POE. Inténtalo de nuevo más tarde.");
        
        default:
          throw new Error(message || `Error del servidor (${status}). No se pudo incrementar la versión del POE.`);
      }
    }
    
    // Error de red o conexión
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      throw new Error("Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo.");
    }
    
    // Error genérico para casos no contemplados
    throw new Error("No se pudo incrementar la versión del POE. Inténtalo de nuevo.");
  }
}
