import api from "../../apiConfig/api";

export interface ICollaborator {
  id_colaborador: string;
  cedula: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  puesto: string;
}

export const getCollaborators = async (
  search?: string
): Promise<ICollaborator[]> => {
  try {
    const response = await api.get("/collaborator", {
      params: { search },
    });
    if (Array.isArray(response.data.data)) {
      return response.data.data.map((item: any) => ({
        id_colaborador: String(item.id_colaborador),
        cedula: item.cedula,
        nombre: item.nombre,
        apellido1: item.apellido1,
        apellido2: item.apellido2,
        puesto: item.puesto,
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching collaborators:", error);
    return [];
  }
};

// Función auxiliar para obtener información básica de un colaborador
const getBasicCollaboratorInfo = async (id_colaborador: string | number) => {
  try {
    const collaborators = await getCollaborators();
    const collaborator = collaborators.find(c => c.id_colaborador === String(id_colaborador));
    if (collaborator) {
      return {
        nombre: collaborator.nombre,
        apellido1: collaborator.apellido1,
        apellido2: collaborator.apellido2,
        cedula: collaborator.cedula,
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting basic collaborator info:", error);
    return null;
  }
};

export interface ICollaboratorDetailPOE {
  id_documento: number;
  codigo: string;
  descripcion: string;
  version: string;
  tipo_documento: string;
  estado_capacitacion: string;
  estado: string | null;
  seguimiento: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  is_evaluado: number | null;
  nota: number | null;
}

export interface ICollaboratorDetailRole {
  nombre_rol: string;
  cedula?: string;
  puesto: string;
  departamento: string;
  area: string;
  poes: ICollaboratorDetailPOE[];
}

export interface ICollaboratorDetail {
  id_colaborador: number;
  cedula?: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  roles: ICollaboratorDetailRole[];
  id_documento: number;
}

export interface ICollaboratorDetailError {
  type: 'no_procedures' | 'not_found' | 'general_error';
  message: string;
  collaboratorInfo?: {
    nombre: string;
    apellido1: string;
    apellido2: string;
    cedula?: string;
  };
}

export const getCollaboratorDetail = async (
  id_colaborador: string | number
): Promise<ICollaboratorDetail | ICollaboratorDetailError | null> => {
  try {
    const response = await api.get(`/collaboratorList/${id_colaborador}`);
    const data = response.data.data;
    if (!Array.isArray(data) || data.length === 0) return null;

    const rolesMap: Record<string, ICollaboratorDetailRole> = {};
    data.forEach((item: any) => {
      if (!rolesMap[item.nombre_rol]) {
        rolesMap[item.nombre_rol] = {
          nombre_rol: item.nombre_rol,
          cedula: item.cedula,
          puesto: item.puesto,
          departamento: item.departamento,
          area: item.area,
          poes: [],
        };
      }
      rolesMap[item.nombre_rol].poes.push({
        id_documento: item.id_documento,
        codigo: item.codigo,
        descripcion: item.descripcion,
        version: item.version,
        tipo_documento: item.tipo_documento,
        estado_capacitacion: item.estado_capacitacion,
        estado: item.estado,
        seguimiento: item.seguimiento,
        fecha_inicio: item.fecha_inicio,
        fecha_fin: item.fecha_fin,
        is_evaluado: item.is_evaluado,
        nota: item.nota,
      });
    });

    return {
      id_colaborador: data[0].id_colaborador,
      cedula: data[0].cedula,
      nombre: data[0].nombre,
      apellido1: data[0].apellido1,
      apellido2: data[0].apellido2,
      roles: Object.values(rolesMap),
      id_documento: data[0].id_documento,
    };
  } catch (error: any) {
    console.error("Error fetching collaborator detail:", error);
    
    // Manejar el caso específico de colaborador sin procedimientos
    if (error.response?.status === 404) {
      const errorMessage = error.response?.data?.message;
      if (errorMessage && errorMessage.includes("procedimientos")) {
        // Intentar obtener información básica del colaborador
        const basicInfo = await getBasicCollaboratorInfo(id_colaborador);
        return {
          type: 'no_procedures',
          message: errorMessage,
          collaboratorInfo: basicInfo || undefined
        };
      }
      return {
        type: 'not_found',
        message: "Colaborador no encontrado"
      };
    }
    
    return {
      type: 'general_error',
      message: "Error al cargar la información del colaborador"
    };
  }
};
