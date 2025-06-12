import { useState } from "react";

export interface Facilitador {
  id: string;
  nombre: string;
  apellido: string;
  identificacion: string;
}

const facilitadoresInternos: Facilitador[] = [
  { id: "1", nombre: "Juan", apellido: "Pérez", identificacion: "12345" },
  { id: "2", nombre: "Ana", apellido: "García", identificacion: "67890" },
  { id: "3", nombre: "Luis", apellido: "Martínez", identificacion: "54321" },
];

export const useFacilitatorForm = () => {
  const [tipo, setTipo] = useState("");
  const [internoSeleccionado, setInternoSeleccionado] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [identificacion, setIdentificacion] = useState("");

  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setTipo(value);
    if (value === "Externo") {
      setInternoSeleccionado("");
      setNombre("");
      setApellido("");
      setIdentificacion("");
    }
  };

  const handleInternoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setInternoSeleccionado(id);
    const found = facilitadoresInternos.find((f) => f.id === id);
    if (found) {
      setNombre(found.nombre);
      setApellido(found.apellido);
      setIdentificacion(found.identificacion);
    } else {
      setNombre("");
      setApellido("");
      setIdentificacion("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const facilitador = { tipo, nombre, apellido, identificacion };
  };

  return {
    tipo,
    setTipo,
    internoSeleccionado,
    nombre,
    setNombre,
    apellido,
    setApellido,
    identificacion,
    setIdentificacion,
    handleTipoChange,
    handleInternoChange,
    handleSubmit,
    facilitadoresInternos,
  };
};
