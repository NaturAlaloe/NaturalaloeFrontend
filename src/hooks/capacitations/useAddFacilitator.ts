import { useEffect, useState } from "react";
import {
  getFacilitadoresInternos,
  createFacilitador,
  type Facilitador,
} from "../../services/addFacilitatorService";

export const useFacilitatorForm = () => {
  const [tipo, setTipo] = useState("");
  const [internoSeleccionado, setInternoSeleccionado] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [facilitadoresInternos, setFacilitadoresInternos] = useState<Facilitador[]>([]);

  useEffect(() => {
    if (tipo === "Interno") {
      getFacilitadoresInternos()
        .then(setFacilitadoresInternos)
        .catch((err) => {
          console.error("Error al cargar internos:", err);
          setFacilitadoresInternos([]);
        });
    }
  }, [tipo]);

  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setTipo(value);
    setInternoSeleccionado("");
    setNombre("");
    setApellido("");
    setIdentificacion("");
  };

  const handleInternoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setInternoSeleccionado(id);
    const found = facilitadoresInternos.find(
      (f) => f.id_facilitador.toString() === id
    );
    if (found) {
      setNombre(found.nombre);
      setApellido(found.apellido);
      setIdentificacion(found.identificacion);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tipo || !nombre || !apellido || !identificacion) {
      alert("Por favor complete todos los campos.");
      return;
    }

    const tipoFacilitador = tipo.toLowerCase() as "interno" | "externo";

    const payload: any = {
      tipo_facilitador: tipoFacilitador,
      nombre,
      apellido,
      identificacion,
    };

    if (tipoFacilitador === "interno") {
      if (!internoSeleccionado) {
        alert("Debe seleccionar un facilitador interno.");
        return;
      }
      payload.id_colaborador = parseInt(internoSeleccionado);
    }

    try {
      await createFacilitador(payload);
      alert("Facilitador guardado correctamente.");

      // Limpiar formulario
      setTipo("");
      setInternoSeleccionado("");
      setNombre("");
      setApellido("");
      setIdentificacion("");
    } catch (error: any) {
      console.error("Error al guardar facilitador:", error.response?.data || error.message);
      alert("Error al guardar facilitador.");
    }
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
