import { useState } from "react";
// Este Hook maneja el estado y la lógica para la finalización de capacitaciones
export const useCapacitationFinished = () => {
  const [step, setStep] = useState(1);
  const rows = 7;
  const cols = 4;

  return {
    step,
    setStep,
    rows,
    cols,
  };
};
