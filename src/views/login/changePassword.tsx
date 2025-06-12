import { useState } from "react";
import InputField from "../../components/formComponents/InputField";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Por favor completa todos los campos");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Las contraseñas nuevas no coinciden");
      return;
    }
    setIsSubmitting(true);
    // Aquí va tu lógica real de cambio de contraseña (API call)
    setTimeout(() => {
      setIsSubmitting(false);
      showCustomToast("Éxito", "Contraseña actualizada correctamente");
        // Redirigir a ñlogin 
        setTimeout(() => {
        window.location.replace("/login");
        }, 2000);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#eafbf2] to-[#d6f5e3] flex items-center justify-center p-6 font-[Poppins]">
      <div className="bg-white rounded-[2rem] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.1)] w-full max-w-md relative z-10  flex flex-col items-center">
        <h1 className="text-2xl font-bold text-[#2AAC67] mb-2 uppercase tracking-wide text-center drop-shadow">
          Módulo de Seguridad
        </h1>
        <h2 className="text-lg text-[#023047] font-semibold mb-6 text-center relative pb-2 after:content-[''] after:block after:mx-auto after:w-16 after:h-1 after:bg-[#2AAC67] after:rounded after:mt-2 after:animate-slidein">
          Cambia tu contraseña
        </h2>
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
      <style>
        {`
          @keyframes slidein {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
          }
          .after\\:animate-slidein::after {
            animation: slidein 0.3s ease forwards;
          }
        `}
      </style>
    </div>
  );
}