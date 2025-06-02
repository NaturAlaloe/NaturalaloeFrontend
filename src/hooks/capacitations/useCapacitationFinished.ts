import { useState } from "react";

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
