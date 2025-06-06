import { useState,  } from "react";

interface Poe {
  codigo: string;
  titulo: string;
  [key: string]: any;
}

export function usePoeSearch(poees: Poe[]) {
  const [busqueda, setBusqueda] = useState<string>("");
  const [showSugerencias, setShowSugerencias] = useState<boolean>(false);

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