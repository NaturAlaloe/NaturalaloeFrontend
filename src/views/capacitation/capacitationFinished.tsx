import { useState } from "react";
import FormContainer from "../../components/formComponents/FormContainer";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import SearchBar from "../../components/globalComponents/SearchBarTable";
import InputField from "../../components/formComponents/InputField";
import SelectField from "../../components/formComponents/SelectField";
import SubmitButton from "../../components/formComponents/SubmitButton";

interface Colaborador {
  id: number;
  nombre: string;
  nota: string;
  seguimiento: string;
  comentario: string;
}

const CalificarColaboradoresPage = () => {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([
    { id: 1, nombre: "Juan Pérez", nota: "", seguimiento: "", comentario: "" },
    { id: 2, nombre: "Ana Gómez", nota: "", seguimiento: "", comentario: "" },
    { id: 3, nombre: "Carlos Ramírez", nota: "", seguimiento: "", comentario: "" },
    
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filtered = colaboradores.filter((c) =>
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (id: number, field: keyof Colaborador, value: string) => {
    setColaboradores((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleGuardarTodos = () => {
    alert("Calificaciones y seguimientos guardados correctamente.");
    console.log("Datos guardados:", colaboradores);
  };

  const columns = [
    {
      name: "Nombre",
      selector: (row: Colaborador) => row.nombre,
      sortable: true,
    },
    {
      name: "Nota",
      cell: (row: Colaborador) => (
        <InputField
          type="number"
          name={`nota-${row.id}`}
          value={row.nota}
          onChange={(e) => handleChange(row.id, "nota", e.target.value)}
          className="w-20 text-sm"
          min={0}
          max={100}
        />
      ),
    },
    {
      name: "Seguimiento",
      cell: (row: Colaborador) => (
        <SelectField
          name={`seguimiento-${row.id}`}
          value={row.seguimiento}
          onChange={(e) => handleChange(row.id, "seguimiento", e.target.value)}
          options={["Satisfactorio", "Reprogramar", "Reevaluación"]}
        />
      ),
    },
    {
      name: "Comentario",
      cell: (row: Colaborador) => (
        <textarea
          name={`comentario-${row.id}`}
          value={row.comentario}
          onChange={(e) => handleChange(row.id, "comentario", e.target.value)}
          rows={3}
          className="w-full border border-[#2AAC67] rounded-lg px-2 py-1 text-sm text-[#2AAC67] resize-none"
        />
      ),
    },
  ];

  const customStyles = {
    table: {
      style: {
        border: "1px solid #D1D5DB",
        borderRadius: "0.5rem",
        overflow: "hidden",
      },
    },
    rows: {
      style: {
        backgroundColor: "transparent",
        "&:hover": {
          backgroundColor: "#F0FFF4",
          color: "#2AAC67",
        },
      },
    },
    headRow: {
      style: {
        backgroundColor: "#F0FFF4",
      },
    },
    headCells: {
      style: {
        color: "#2AAC67",
        fontWeight: "normal",
        textTransform: "uppercase",
        fontSize: "0.75rem",
        letterSpacing: "0.05em",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        fontFamily: "inherit",
      },
    },
    cells: {
      style: {
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        fontFamily: "inherit",
        color: "#2AAC67",
      },
    },
  };

  return (
    <FormContainer title="Calificación de Colaboradores">
      <div className="mb-6">
        <SearchBar
          value={searchTerm}
          onChange={(val) => setSearchTerm(val)}
          placeholder="Buscar por nombre..."
        />
      </div>

      <GlobalDataTable
        columns={columns}
        data={filtered}
        pagination
        rowsPerPage={5}
        customStyles={customStyles}
      />

      <div className="flex justify-center mt-6">
        <SubmitButton onClick={handleGuardarTodos}>
          Guardar calificaciones
        </SubmitButton>
      </div>
    </FormContainer>
  );
};

export default CalificarColaboradoresPage;
