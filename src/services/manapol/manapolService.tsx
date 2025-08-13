import api from "../../apiConfig/api";

export async function getManapolList() {
  const response = await api.get("/registerMan/versions");
  return response.data.data; 
}

export async function getManapoolLastConsecutive() {
  try {
    const response = await api.get("/registerMan/consecutive");
    const data = response.data.data;
    
    // Si no hay datos, el primer registro será RM-001
    if (!data || !Array.isArray(data) || data.length === 0) {
      return "RM-001";
    }
    
    const { prefijo, consecutivo_actual } = data[0];
    
    // El consecutivo_actual es el último que existe en BD
    // Por lo tanto, el siguiente disponible es consecutivo_actual + 1
    const siguienteNumero = parseInt(consecutivo_actual) + 1;
    const siguienteConsecutivo = siguienteNumero.toString().padStart(3, '0');
    
    return `${prefijo}-${siguienteConsecutivo}`;
  } catch (error) {
    // En caso de error, lanzar la excepción para que el hook la maneje
    console.error("Error al obtener consecutivo:", error);
    throw new Error("No se pudo obtener el código consecutivo. Inténtalo de nuevo.");
  }
}

export async function getObsoleteManapolList() {
  try {
    const response = await api.get("/registerMan/obsolete");
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener lista de Manapol obsoletos:", error);
    throw new Error("No se pudo obtener la lista de Manapol obsoletos. Inténtalo de nuevo.");
  }
}

export async function createManapol(formData: FormData) {
  const response = await api.post("/registerMan", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export const updateManapol = async (formData: FormData) => {
  const response = await api.put(`/registerMan/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// export const createNewManapolVersion = async (formData: FormData) => {
//   const response = await api.post(`/registerMan/increase`, formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
//   return response.data;
// };

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