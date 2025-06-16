import axiosInstance from "../../apiConfig/api";

export interface Collaborator {
    id_colaborador: number;
    id_puesto: number;
    nombre: string;
    apellido: string;
    fecha_nacimiento: Date;
    numero: string;
    correo: string;
}

export const addCollaborator = async (): Promise<{ data: Collaborator } | null> => {
    try {
        const response = await axiosInstance.put<{ data: Collaborator }>("/collaborator");
        return response.data;
    } catch (error) {
        console.error("Error al insertar el usuario:", error);
        return null;
    }
};
