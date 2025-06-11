import { useState } from "react";
//Este Hook maneja el estado y la lógica para la lista de capacitaciones
export function useCapacitationList() {
  const [showModal, setShowModal] = useState(false);

  // Ejemplo de varias capacitaciones con campo estado
  const capacitaciones = [
    {
      id: "001",
      fechaInicio: "2024-06-01",
      fechaFinal: "2024-06-05",
      comentario: "Inducción general",
      evaluado: "Sí",
      metodo: "Teórico",
      seguimiento: "Reprogramar",
      estado: "Finalizado",
      colaborador: {
        nombreCompleto: "Juan Pérez",
        cedula: "123456789",
        correo: "juan.perez@email.com",
        telefono: "555-1234",
        area: "Producción",
        departamento: "Operaciones",
        puesto: "Operador",
      },
      profesor: {
        nombre: "Ana",
        apellido: "García",
        identificacion: "987654321",
      },
    },
    {
      id: "002",
      fechaInicio: "2024-06-10",
      fechaFinal: "2024-06-12",
      comentario: "Capacitación en seguridad",
      evaluado: "No",
      metodo: "Práctico",
      seguimiento: "Satisfactorio",
      estado: "Pendiente",
      colaborador: {
        nombreCompleto: "María López",
        cedula: "987654321",
        correo: "maria.lopez@email.com",
        telefono: "555-5678",
        area: "Calidad",
        departamento: "Control",
        puesto: "Supervisora",
      },
      profesor: {
        nombre: "Carlos",
        apellido: "Ramírez",
        identificacion: "123123123",
      },
    },
    {
      id: "003",
      fechaInicio: "2024-07-01",
      fechaFinal: "2024-07-03",
      comentario: "Actualización de procesos",
      evaluado: "Sí",
      metodo: "Mixto",
      seguimiento: "Reevaluación",
      estado: "Finalizado",
      colaborador: {
        nombreCompleto: "Pedro Sánchez",
        cedula: "456789123",
        correo: "pedro.sanchez@email.com",
        telefono: "555-8765",
        area: "Logística",
        departamento: "Almacén",
        puesto: "Encargado",
      },
      profesor: {
        nombre: "Lucía",
        apellido: "Fernández",
        identificacion: "321321321",
      },
    },
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleRowClick = (index: number) => {
    setSelectedIndex(index);
    setShowModal(true);
  };

  return {
    showModal,
    setShowModal,
    colaborador: capacitaciones[selectedIndex].colaborador,
    profesor: capacitaciones[selectedIndex].profesor,
    selectedCapacitation: capacitaciones[selectedIndex],
    handleRowClick,
    capacitaciones,
  };
}
