import { useState } from "react";

export function useCapacitation() {
  const [showColaboradorModal, setShowColaboradorModal] = useState(false);
  const [showFacilitadorModal, setShowFacilitadorModal] = useState(false);
  const [isEvaluado, setIsEvaluado] = useState(false);
  const [showAsignacionesModal, setShowAsignacionesModal] = useState(false);

  const [colaboradoresAsignados, setColaboradoresAsignados] = useState<string[]>([
    "Juan Pérez",
    "María López",
  ]);
  const [poesAsignados, setPoesAsignados] = useState<string[]>([
    "700-50-001 - Nombre Procedimiento",
  ]);
  const [nuevoPoe, setNuevoPoe] = useState("");

  const poesDisponibles = [
    "700-50-001 - Nombre Procedimiento",
    "500-53-002 - Nombre Procedimiento",
    "600-40-003 - Nombre Procedimiento",
  ];

  const handleAgregarPoe = () => {
    if (nuevoPoe && !poesAsignados.includes(nuevoPoe)) {
      setPoesAsignados([...poesAsignados, nuevoPoe]);
      setNuevoPoe("");
    }
  };

  return {
    showColaboradorModal,
    setShowColaboradorModal,
    showFacilitadorModal,
    setShowFacilitadorModal,
    isEvaluado,
    setIsEvaluado,
    showAsignacionesModal,
    setShowAsignacionesModal,
    colaboradoresAsignados,
    setColaboradoresAsignados,
    poesAsignados,
    setPoesAsignados,
    nuevoPoe,
    setNuevoPoe,
    poesDisponibles,
    handleAgregarPoe,
  };
}