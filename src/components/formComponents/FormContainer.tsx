
import { motion } from "framer-motion";
import type { FormEventHandler, ReactNode } from "react";

interface FormContainerProps {
  title?: string;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
  buttonText?: string;
}

export default function FormContainer({
  title = "Formulario",
  onSubmit,
  children,
}: FormContainerProps) {
  return (
    <div className="min-h-screen bg-[#DEF7E9] flex items-start justify-center px-4 py-12 font-[Poppins]">
      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-11/12 md:w-[80%] p-10 space-y-10 bg-white border border-[#2AAC67] rounded-2xl shadow-2xl"
      >
        {/* Encabezado */}
        <div className="flex items-center justify-center gap-4">
          <div className="bg-[#2AAC67] w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
            📄
          </div>
          <h2 className="text-3xl font-bold text-[#2AAC67] text-center">
            {title}
          </h2>
        </div>

        {/* Campos personalizados */}
        <div>{children}</div>

        {/* Botón */}
    
      </motion.form>
    </div>
  );
}