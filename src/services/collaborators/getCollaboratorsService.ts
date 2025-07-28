import axiosInstance from "../../apiConfig/api";

export interface Collaborator {
    id_colaborador: number;
    cedula: string;
    puesto: string;
    nombre: string;
    apellido1: string;
    apellido2: string;
    fecha_nacimiento: Date;
    numero: string;
    correo: string;
}

export const getCollaborators = async (): Promise<Collaborator[]> => {
    const response = await axiosInstance.get<{ data: Collaborator[] }>("/collaborator");
    return response.data.data;
};
