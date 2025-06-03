// hooks/useAgregarFacilitador.ts
import { useState } from "react";

export const useAddFacilitator = () => {
  const [step, setStep] = useState(1);

  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");

  const [profesorNombre, setProfesorNombre] = useState("");
  const [profesorApellido, setProfesorApellido] = useState("");
  const [profesorId, setProfesorId] = useState("");

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleBack = () => setStep(1);

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    alert("¡Capacitación guardada!");
  };

  return {
    step,
    nombre,
    tipo,
    profesorNombre,
    profesorApellido,
    profesorId,
    setNombre,
    setTipo,
    setProfesorNombre,
    setProfesorApellido,
    setProfesorId,
    handleNext,
    handleBack,
    handleGuardar,
  };
};
