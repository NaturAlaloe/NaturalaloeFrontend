import axiosInstance from "../../apiConfig/api";

export interface User {
    nombre: string;
    apellido1: string;
    apellido2: string;
    email: string;
    contrasena: string;
}

export const addUser = async (userData: User): Promise<{ data: User }> => {
    const response = await axiosInstance.post<{ data: User }>("/user", userData);
    return response.data;
};

