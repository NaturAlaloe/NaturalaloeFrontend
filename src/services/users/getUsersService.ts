import axiosInstance from "../../apiConfig/api";

export interface User {
    id_usuario : number;
    nombre: string;
    apellido1: string;
    apellido2: string;
    email: string;
}

export const getUsers = async (): Promise<User[]> => {
    const response = await axiosInstance.get<{ data: User[] }>("/user");
    return response.data.data;
};
