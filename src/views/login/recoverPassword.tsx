import { useState } from "react";
import { motion } from "framer-motion";
import InputField from "../../components/formComponents/InputField";
import { useNavigate } from "react-router-dom";

export default function RecoverPassword() {
  const [correo, setCorreo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Animación para el formulario
  const formVariants = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -40 },
  };

  // Simulación de envío de correo
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/login/changePassword");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eafbf2] to-[#d6f5e3] flex items-center justify-center px-4 py-6 font-[Poppins]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.1)] px-10 py-8"
      >
        <h2 className="text-3xl font-bold text-[#2AAC67] mb-2 text-center">Recuperar Contraseña</h2>
        <p className="text-gray-500 text-base mb-6 text-center">
          Ingresa tu correo electrónico para recuperar tu contraseña.
        </p>
        <motion.form
          variants={formVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5 }}
          className="space-y-6"
          onSubmit={handleSendEmail}
        >
          <InputField
            label="Correo Electrónico"
            name="correo"
            value={correo}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCorreo(e.target.value)}
            placeholder="ejemplo@correo.com"
            type="email"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#2AAC67] text-white font-semibold text-lg py-3 rounded-full shadow-md hover:bg-[#24965c] transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
          </button>
        </motion.form>
      </motion.div>
    </div>
  );
}