import api from "../../apiConfig/api";

export async function getManapolList() {
  try {
    const response = await api.get("/registerMan/versions");
    return response.data.data;
  } catch (error: any) {
    console.error("Error al obtener lista de Manapol:", error);
    
    // Manejo específico de errores según el código de respuesta HTTP
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message;
      
      switch (status) {
        case 401:
          throw new Error("Token de autenticación requerido. Inicia sesión nuevamente para acceder a los registros.");
        
        case 403:
          throw new Error("No tienes permisos suficientes para consultar registros Manapol. Contacta al administrador del sistema.");
        
        case 404:
          throw new Error("No se encontraron registros Manapol o el endpoint no está disponible.");
        
        case 500:
          throw new Error("Error interno del servidor al obtener registros. Inténtalo de nuevo más tarde.");
        
        default:
          throw new Error(message || `Error del servidor (${status}). No se pudieron obtener los registros Manapol.`);
      }
    }
    
    // Error de red o conexión
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      throw new Error("Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo.");
    }
    
    // Error genérico para casos no contemplados
    throw new Error("No se pudo obtener la lista de registros Manapol. Inténtalo de nuevo.");
  }
}

export async function getManapoolLastConsecutive() {
  try {
    const response = await api.get("/registerMan/consecutive");
    const data = response.data.data;
    
    // La API ahora devuelve el consecutivo ya formateado y sumado
    if (!data || typeof data !== 'string') {
      throw new Error("Formato de respuesta inválido del servidor");
    }
    
    return data;
  } catch (error: any) {
    console.error("Error al obtener consecutivo:", error);
    
    // Manejo específico de errores según el código de respuesta HTTP
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message;
      
      switch (status) {
        case 401:
          throw new Error("Token de autenticación requerido. Inicia sesión nuevamente para obtener el código consecutivo.");
        
        case 403:
          throw new Error("No tienes permisos suficientes para consultar códigos consecutivos. Contacta al administrador del sistema.");
        
        case 404:
          throw new Error("El servicio de códigos consecutivos no está disponible. Contacta al administrador del sistema.");
        
        case 500:
          throw new Error("Error interno del servidor al obtener código consecutivo. Inténtalo de nuevo más tarde.");
        
        default:
          throw new Error(message || `Error del servidor (${status}). No se pudo obtener el código consecutivo.`);
      }
    }
    
    // Error de red o conexión
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      throw new Error("Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo.");
    }
    
    // Error genérico para casos no contemplados
    throw new Error("No se pudo obtener el código consecutivo. Inténtalo de nuevo.");
  }
}

export async function getObsoleteManapolList() {
  try {
    const response = await api.get("/registerMan/obsolete");
    return response.data.data;
  } catch (error: any) {
    console.error("Error al obtener lista de Manapol obsoletos:", error);
    
    // Manejo específico de errores según el código de respuesta HTTP
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message;
      
      switch (status) {
        case 401:
          throw new Error("Token de autenticación requerido. Inicia sesión nuevamente para acceder a los registros obsoletos.");
        
        case 403:
          throw new Error("No tienes permisos suficientes para consultar registros obsoletos. Contacta al administrador del sistema.");
        
        case 404:
          throw new Error("No se encontraron registros obsoletos o el endpoint no está disponible.");
        
        case 500:
          throw new Error("Error interno del servidor al obtener registros obsoletos. Inténtalo de nuevo más tarde.");
        
        default:
          throw new Error(message || `Error del servidor (${status}). No se pudieron obtener los registros obsoletos.`);
      }
    }
    
    // Error de red o conexión
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      throw new Error("Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo.");
    }
    
    // Error genérico para casos no contemplados
    throw new Error("No se pudo obtener la lista de registros Manapol obsoletos. Inténtalo de nuevo.");
  }
}

export async function createManapol(formData: FormData) {
  try {
    const response = await api.post("/registerMan", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error al crear Manapol:", error);
    
    // Manejo específico de errores según el código de respuesta HTTP
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message;
      
      switch (status) {
        case 400:
          throw new Error(message || "Petición inválida: todos los campos son obligatorios (descripción, id_area, departamento, id_responsable, version, fecha_creación, fecha_vigencia y documento PDF)");
        
        case 401:
          throw new Error("Token de autenticación requerido. Inicia sesión nuevamente.");
        
        case 403:
          throw new Error("No tienes permisos suficientes para crear registros Manapol.");
        
        case 409:
          throw new Error(message || "Conflicto: ya existe un registro con los mismos datos o código duplicado");
        
        case 413:
          throw new Error("El archivo PDF es demasiado grande. Reduce el tamaño del archivo e inténtalo de nuevo.");
        
        case 415:
          throw new Error("Tipo de archivo no válido. Solo se permiten archivos PDF.");
        
        case 422:
          throw new Error(message || "Datos de entrada no válidos: verifica que las fechas estén en formato correcto y los campos numéricos sean válidos");
        
        case 500:
          throw new Error("Error interno del servidor al crear el registro. Inténtalo de nuevo más tarde.");
        
        default:
          throw new Error(message || `Error del servidor (${status}). No se pudo crear el registro Manapol.`);
      }
    }
    
    // Error de red o conexión
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      throw new Error("Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo.");
    }
    
    // Error genérico para casos no contemplados
    throw new Error("No se pudo crear el registro Manapol. Inténtalo de nuevo.");
  }
}

export const updateManapol = async (formData: FormData) => {
  try {
    const response = await api.put(`/registerMan/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error al actualizar Manapol:", error);
    
    // Manejo específico de errores según el código de respuesta HTTP
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message;
      
      switch (status) {
        case 400:
          throw new Error(message || "Petición inválida: verificar que todos los campos obligatorios estén completos (id_documento es requerido)");
        
        case 401:
          throw new Error("Token de autenticación requerido. Inicia sesión nuevamente.");
        
        case 403:
          throw new Error("No tienes permisos suficientes para actualizar registros Manapol.");
        
        case 404:
          throw new Error("El registro Manapol especificado no existe. Verifica que el ID del documento sea correcto.");
        
        case 409:
          throw new Error(message || "Conflicto con datos existentes: posible duplicación de código o versión");
        
        case 500:
          throw new Error("Error interno del servidor al actualizar el registro. Inténtalo de nuevo más tarde.");
        
        default:
          throw new Error(message || `Error del servidor (${status}). No se pudo actualizar el registro Manapol.`);
      }
    }
    
    // Error de red o conexión
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      throw new Error("Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo.");
    }
    
    // Error genérico para casos no contemplados
    throw new Error("No se pudo actualizar el registro Manapol. Inténtalo de nuevo.");
  }
};

export async function createNewManapolVersion (formData: FormData) {
  try {
    const response = await api.post(`/registerMan/increase`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error creating new Manapol version:", error);
    
    // Manejo específico de errores según el código de respuesta HTTP
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message;
      
      switch (status) {
        case 400:
          throw new Error(message || "Petición inválida: verificar campos obligatorios (código, nueva versión y vigencia)");
        
        case 401:
          throw new Error("No tienes autorización para realizar esta acción. Inicia sesión nuevamente.");
        
        case 403:
          throw new Error("No tienes permisos suficientes para crear nuevas versiones de Manapol.");
        
        case 404:
          throw new Error("El código RM especificado no existe. Verifica que el código sea correcto.");
        
        case 409:
          throw new Error("No se puede crear nueva versión: faltan colaboradores por capacitar en la versión actual.");
        
        case 500:
          throw new Error("Error interno del servidor al crear la nueva versión. Inténtalo de nuevo más tarde.");
        
        default:
          throw new Error(message || `Error del servidor (${status}). No se pudo crear la nueva versión de Manapol.`);
      }
    }
    
    // Error de red o conexión
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      throw new Error("Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo.");
    }
    
    // Error genérico para casos no contemplados
    throw new Error("No se pudo crear la nueva versión de Manapol. Inténtalo de nuevo.");
  }
}

export async function obsoleteManapol(id: number, razon: string) {
  try {
    const response = await api.patch(`/registerMan/obsolete`, {
      id_documento: id,
      razon: razon
    });
    return response.data;
  } catch (error: any) {
    console.error("Error al obsoletar Manapol:", error);
    
    // Manejo específico de errores según el código de respuesta HTTP
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message;
      
      switch (status) {
        case 400:
          throw new Error(message || "ID del documento y razón son obligatorios");
        
        case 401:
          throw new Error("Token de autenticación requerido. Inicia sesión nuevamente.");
        
        case 403:
          throw new Error("No tienes permisos suficientes para marcar registros como obsoletos.");
        
        case 404:
          throw new Error("El documento especificado no existe.");
        
        case 409:
          throw new Error(message || "El documento ya está marcado como obsoleto");
        
        case 500:
          throw new Error("Error interno del servidor al marcar registro como obsoleto.");
        
        default:
          throw new Error(message || `Error del servidor (${status}). No se pudo marcar como obsoleto.`);
      }
    }
    
    // Error de red o conexión
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      throw new Error("Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo.");
    }
    
    // Error genérico para casos no contemplados
    throw new Error("No se pudo marcar el registro como obsoleto. Inténtalo de nuevo.");
  }
}

export async function reactivateManapol(id: number, razon: string) {
  try {
    const response = await api.patch(`/registerMan/reactivate`, {
      id_documento: id,
      razon: razon
    });
    return response.data;
  } catch (error: any) {
    console.error("Error al reactivar Manapol:", error);
    
    // Manejo específico de errores según el código de respuesta HTTP
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message;
      
      switch (status) {
        case 400:
          throw new Error(message || "ID del documento y razón son obligatorios");
        
        case 401:
          throw new Error("Token de autenticación requerido. Inicia sesión nuevamente.");
        
        case 403:
          throw new Error("No tienes permisos suficientes para reactivar registros.");
        
        case 404:
          throw new Error("El documento especificado no existe.");
        
        case 409:
          throw new Error(message || "El documento ya está activo/vigente");
        
        case 500:
          throw new Error("Error interno del servidor al reactivar registro.");
        
        default:
          throw new Error(message || `Error del servidor (${status}). No se pudo reactivar.`);
      }
    }
    
    // Error de red o conexión
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      throw new Error("Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo.");
    }
    
    // Error genérico para casos no contemplados
    throw new Error("No se pudo reactivar el registro. Inténtalo de nuevo.");
  }
}

