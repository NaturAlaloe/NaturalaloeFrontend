import api from "../../apiConfig/api";

export interface Procedure {
  id_poe: number | null;
  titulo: string;
  departamento: string;
  responsable: string;
  revision: string;
  fecha_vigencia: string;
  estado: string;
}

export const getActiveProcedures = async (): Promise<Procedure[]> => {
  const response = await api.get("/procedureActive");
  if (response.data.success) {
    console.log("Procedimientos activos obtenidos:", response.data.data); 
    return response.data.data;

  }
  throw new Error("Error al obtener los procedimientos");
};