import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

// Simulación de datos para responsables, puestos y categorías
const responsables: { nombre: string }[] = [
  { nombre: "Juan Pérez" },
  { nombre: "Ana Gómez" },
  { nombre: "Luis Torres" },
];

const puestos: { id: number; nombre: string }[] = [
  { id: 1, nombre: "Administrativo" },
  { id: 2, nombre: "Operativo" },
  { id: 3, nombre: "Gerencial" },
];

const categorias: { nombre: string }[] = [
  { nombre: "General" },
  { nombre: "Seguridad" },
  { nombre: "Calidad" },
];

// Simulación de políticas existentes para la búsqueda
const politicasExistentes: {
  codigo: string;
  descripcion: string;
  categoria: string;
}[] = [
  {
    codigo: "POL-001",
    descripcion: "Política de Seguridad",
    categoria: "Seguridad",
  },
  {
    codigo: "POL-002",
    descripcion: "Política de Calidad",
    categoria: "Calidad",
  },
  { codigo: "POL-003", descripcion: "Política General", categoria: "General" },
];

export function usePoliticsForm() {
  const [formData, setFormData] = useState({
    codigo: "",
    descripcion: "",
    responsable: "",
    categoria: "",
    puestos: [] as string[],
  });

  // Barra de búsqueda de políticas existentes
  const [busqueda, setBusqueda] = useState("");
  const [showSugerencias, setShowSugerencias] = useState(false);
  const resultados = politicasExistentes.filter(
    (pol) =>
      pol.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
      pol.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "select-multiple") {
      const selectedOptions = (e.target as HTMLSelectElement).selectedOptions;
      const values = Array.from(selectedOptions, (option) => option.value);
      setFormData((prev: any) => ({ ...prev, [name]: values }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aquí puedes manejar el envío del formulario
    console.log(formData);
  };

  return {
    formData,
    setFormData,
    busqueda,
    setBusqueda,
    showSugerencias,
    setShowSugerencias,
    resultados,
    handleChange,
    handleSubmit,
    responsables,
    puestos,
    categorias,
  };
}
