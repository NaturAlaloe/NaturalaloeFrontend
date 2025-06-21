import { useEffect, useState } from "react";
import {
  getColaboradoresDisponibles,
  createFacilitador,
  type Facilitador,
} from "../../services/addFacilitatorService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

// Este hook maneja el formulario para agregar un facilitador, ya sea interno o externo

export const useFacilitatorForm = () => {
  const [tipo, setTipo] = useState("");
  const [internoSeleccionado, setInternoSeleccionado] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [facilitadoresInternos, setFacilitadoresInternos] = useState<Facilitador[]>([]);

  useEffect(() => {
    if (tipo === "Interno") {
      getColaboradoresDisponibles()
        .then(setFacilitadoresInternos)
        .catch((err) => {
          console.error("Error al cargar colaboradores:", err);
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
      setIdentificacion(found.identificacion); // ← esto ya es la cédula (id_colaborador)
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
      showCustomToast(
        "Éxito", "Facilitador guardado exitosamente.",
        "success"
      );

      // Limpiar formulario
      setTipo("");
      setInternoSeleccionado("");
      setNombre("");
      setApellido("");
      setIdentificacion("");
    } catch (error: any) {
      showCustomToast(
        "Error", "Error al guardar el facilitador.",
        "error"
      );
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
