import api from "../../apiConfig/api";

export interface ICollaborator {
  id_colaborador: string;
  nombre_completo: string;
  puesto: string;
}

export const getCollaborators = async (search?: string): Promise<ICollaborator[]> => {
  try {
    const response = await api.get('/collaborator', {
      params: { search }
    });
    if (Array.isArray(response.data.data)) {
      return response.data.data.map((item: any) => ({
        id_colaborador: String(item.id_colaborador),
        nombre_completo: item.nombre_completo,
        puesto: item.puesto,
      }));
      console.log(response.data.data);
    }
    return [];
  } catch (error) {
    console.error('Error fetching collaborators:', error);
    return [];
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
  puesto: string;
  departamento: string;
  area: string;
  poes: ICollaboratorDetailPOE[];
}

export interface ICollaboratorDetail {
  id_colaborador: number;
  nombre_completo: string;
  roles: ICollaboratorDetailRole[];
}

export const getCollaboratorDetail = async (id_colaborador: string | number): Promise<ICollaboratorDetail | null> => {
  try {
    const response = await api.get(`/collaboratorList/${id_colaborador}`);
    const data = response.data.data;
    if (!Array.isArray(data) || data.length === 0) return null;

    // Agrupar por nombre_rol
    const rolesMap: Record<string, ICollaboratorDetailRole> = {};
    data.forEach((item: any) => {
      if (!rolesMap[item.nombre_rol]) {
        rolesMap[item.nombre_rol] = {
          nombre_rol: item.nombre_rol,
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
      nombre_completo: data[0].nombre_completo,
      roles: Object.values(rolesMap),
    };
  } catch (error) {
    console.error('Error fetching collaborator detail:', error);
    return null;
  }
};