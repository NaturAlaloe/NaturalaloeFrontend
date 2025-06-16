import "@fontsource/poppins/700.css";
import InputField from "../../components/formComponents/InputField";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LogoNaturaloe from "../../assets/img/Logo_Naturaloe.png";
import { Link, useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SubmitButton from "../../components/formComponents/SubmitButton";
import useLogin from "../../hooks/login/useLogin"; // ajusta la ruta según tu estructura

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const { login, error, success, loading } = useLogin();

  // Llama a onLoginSuccess cuando el login sea exitoso
  useEffect(() => {
    if (success) {
      onLoginSuccess();
    }
  }, [success, onLoginSuccess]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({
      email: formData.correo,
      contrasena: formData.contrasena,
    });
  };

  return (
    <div className="min-h-screen bg-[#DEF7E9] flex items-center justify-center px-4 py-6 font-[Poppins]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-2xl bg-white rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.1)] px-15 py-8"
      >
        <div className="flex flex-row items-center justify-between mb-8">
          <div className="flex flex-col items-start">
            <h2 className="text-4xl font-bold text-[#2AAC67] mb-1">¡Bienvenido!</h2>
            <p className="text-gray-500 text-base">Por favor, inicia sesión para continuar</p>
          </div>
          <img
            src={LogoNaturaloe}
            alt="Natural Aloe Logo"
            className="w-46 h-46 ml-6 drop-shadow-md"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Correo Electrónico"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            placeholder="ejemplo@correo.com"
            type="email"
            required
          />

          <div className="relative">
            <InputField
              label="Contraseña"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              placeholder="********"
              type={showPassword ? "text" : "password"}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[70%] -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              tabIndex={-1}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <SubmitButton width="w-full" disabled={loading}>
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </SubmitButton>

          <div className="text-center mt-2">
            <Link
              to="/login/recoverPassword"
              className="text-sm text-[#2AAC67] hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
