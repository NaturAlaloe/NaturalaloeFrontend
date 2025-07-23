import { useState } from "react";
import { loginService } from "../../services/login/loginService"; // Asegúrate que esta ruta sea correcta
import type { LoginData } from "../../services/login/loginService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster"; // <-- Agrega esta línea

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
          showCustomToast("Información", 'Credenciales incorrectas.', "info");
        } else if (status === 404) {
          showCustomToast("Error", "Usuario no encontrado.", "error");
        } else if (status === 403) {
          showCustomToast("Información", "Usuario deshabilitado, por favor, contactese con el administrador.", "info");
        } else if (status === 500) {
          showCustomToast("Error", "Error del servidor, por favor intenta más tarde.", "error");
        } else {
          showCustomToast("Error al iniciar sesión", err.message, "error");
        }
      } else {
        showCustomToast("Error al iniciar sesión", err.message, "error");
      }
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, success };
};

export default useLogin;
