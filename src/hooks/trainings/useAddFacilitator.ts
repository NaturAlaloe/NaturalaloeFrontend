import { useEffect, useState } from "react";
import {
  getColaboradoresDisponibles,
  createFacilitador,
  type Facilitador,
} from "../../services/addFacilitatorService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

export const useFacilitatorForm = () => {
  const [tipo, setTipo] = useState("");
  const [internoSeleccionado, setInternoSeleccionado] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido1, setApellido1] = useState("");
  const [apellido2, setApellido2] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [facilitadoresInternos, setFacilitadoresInternos] = useState<
    Facilitador[]
  >([]);

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
    setApellido1("");
    setApellido2("");
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
      setApellido1(found.apellido1);
      setApellido2(found.apellido2);
      setIdentificacion(found.identificacion);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !tipo ||
      !nombre ||
      !apellido1 ||
      !apellido2 ||
      (tipo === "Interno" && !identificacion)
    ) {
      alert("Por favor complete todos los campos.");
      return;
    }

    const payload: any = {
      tipo_facilitador: tipo.toLowerCase(),
      nombre,
      apellido1,
      apellido2,
      ...(tipo === "Interno" && {
        identificacion,
        id_colaborador: parseInt(internoSeleccionado),
      }),
    };

    try {
      await createFacilitador(payload);
      showCustomToast("Éxito", "Facilitador guardado exitosamente.", "success");

      setTipo("");
      setInternoSeleccionado("");
      setNombre("");
      setApellido1("");
      setApellido2("");
      setIdentificacion("");
    } catch (error: any) {
      showCustomToast("Error", "Error al guardar el facilitador.", "error");
    }
  };

  return {
    tipo,
    setTipo,
    internoSeleccionado,
    nombre,
    setNombre,
    apellido1,
    setApellido1,
    apellido2,
    setApellido2,
    identificacion,
    setIdentificacion,
    handleTipoChange,
    handleInternoChange,
    handleSubmit,
    facilitadoresInternos,
  };
};
