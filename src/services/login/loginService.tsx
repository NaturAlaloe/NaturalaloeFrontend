import axiosInstance from "../../apiConfig/api";

export interface LoginData {
  email: string;
  contrasena: string;
}

export async function loginService(data: LoginData) {
  const response = await axiosInstance.post("/login", data);
  return response.data;
}
