import { useState } from "react";

export function usePoeSearch(poees) {
  const [busqueda, setBusqueda] = useState("");
  const [showSugerencias, setShowSugerencias] = useState(false);

  const resultados = poees.filter(
    (poe) =>
      poe.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
      poe.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return {
    busqueda,
    setBusqueda,
    showSugerencias,
    setShowSugerencias,
    resultados,
  };
}