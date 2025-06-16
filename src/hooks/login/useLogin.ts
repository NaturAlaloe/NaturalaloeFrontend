import { useState } from "react";
import { loginService } from "../../services/login/loginService"; // Asegúrate que esta ruta sea correcta
import type { LoginData } from "../../services/login/loginService";
import axios from "axios";

const useLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const login = async (formData: LoginData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await loginService(formData);

      setSuccess(true);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 401) {
          setError("Credenciales incorrectas.");
        } else if (status === 404) {
          setError("Usuario no encontrado.");
        } else if (status === 500) {
          setError("Error del servidor. Intente más tarde.");
        } else {
          setError("Error desconocido al iniciar sesión.");
        }
      } else {
        setError("Error inesperado al iniciar sesión.");
      }
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, success };
};

export default useLogin;
