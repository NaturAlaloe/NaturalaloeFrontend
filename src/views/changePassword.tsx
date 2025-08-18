import { useState } from "react";
import { useLocation } from "react-router-dom";
import InputField from "../components/formComponents/InputField";
import { showCustomToast } from "../components/globalComponents/CustomToaster";
import api from "../apiConfig/api";

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
   

    if (!newPassword || !confirmPassword) {
      showCustomToast("Error", "Por favor completa todos los campos", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showCustomToast("Error", "Las contraseñas nuevas no coinciden", "error");
      return;
    }
    if (!token) {
      showCustomToast("Error", "Token inválido o faltante", "error");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const payload = {
        token,
        newPassword: newPassword
      };

      

      const res = await api.post("/resetPassword", payload);


      if (res.data.success) {
        showCustomToast("Éxito", "Contraseña restablecida correctamente", "success");
        setTimeout(() => { window.location.replace("http://192.168.1.205:8081/"); }, 2000);
      } else {
        showCustomToast("Error", res.data.message, "error");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.group("Error en la solicitud");
      console.error("Error completo:", err);
   
      if (err.response) {
  
      }
      console.groupEnd();

      if (err.response?.data?.message) {
        showCustomToast("Error", err.response.data.message, "error");
      } else {
        showCustomToast("Error", "Error al restablecer la contraseña", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eafbf2]">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-4 text-[#2AAC67]">Enlace inválido</h2>
          <p>
            El enlace para restablecer la contraseña no es válido o ha expirado.<br />
            Solicita uno nuevo desde la página de recuperación.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#eafbf2] to-[#d6f5e3] flex items-center justify-center p-6 font-[Poppins]">
      <div className="bg-white rounded-[2rem] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.1)] w-full max-w-md relative z-10  flex flex-col items-center">
        <h1 className="text-2xl font-bold text-[#2AAC67] mb-2 uppercase tracking-wide text-center drop-shadow">
          Restablecer Contraseña
        </h1>
        <form className="w-full flex flex-col gap-4" onSubmit={handleChangePassword}>
          <InputField
            label="Nueva Contraseña"
            name="newPassword"
            value={newPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
            placeholder="Nueva contraseña"
            type="password"
            required
          />
          <InputField
            label="Confirmar Nueva Contraseña"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            placeholder="Confirmar nueva contraseña"
            type="password"
            required
          />
          <button
            type="submit"
            className="bg-[#2AAC67] hover:bg-[#24965c] text-white font-bold py-3 rounded-md w-full mt-2 transition disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Procesando..." : "Actualizar Contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}