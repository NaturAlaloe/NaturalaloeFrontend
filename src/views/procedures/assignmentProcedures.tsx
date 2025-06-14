import { useState } from "react";
import {
  Button,
  Box,
  Chip,
  Tooltip,
} from "@mui/material";
import ProceduresTableModal, { Procedimiento } from "../../components/ProceduresTableModal";
import GlobalModal from "../../components/globalComponents/GlobalModal";
import SubmitButton from "../../components/formComponents/SubmitButton";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import type { TableColumn } from "react-data-table-component";
import SearchBar from "../../components/globalComponents/SearchBarTable";

const procedimientosEjemplo = [
  { poe: "POE-001", titulo: "Limpieza de equipos" },
  { poe: "POE-002", titulo: "Control de calidad" },
  { poe: "POE-003", titulo: "Muestreo de producto" },
  // ...agrega más para probar paginación
];

const rolesDisponibles = [
  "Administrador",
  "Supervisor",
  "Operador",
  "Invitado",
  "Gerente de Planta",
  "Gerente de Calidad",
  "Gerente de Producción",
  "Gerente de Logística",
  "Gerente de Mantenimiento",
  "Gerente de Recursos Humanos",
  "Gerente de Finanzas",
  "Gerente de Ventas",
  "Gerente de Marketing",
  "Gerente de IT",
  "Gerente de Seguridad",
  "Gerente de Proyectos",
  "Gerente de Innovación",

];

export default function RolesProcedures() {
  const [search, setSearch] = useState("");
  const [roles] = useState<string[]>(rolesDisponibles);
  const [procedimientos] = useState<Procedimiento[]>(procedimientosEjemplo);

  // Un rol tiene muchos procedimientos
  const [procedimientosPorRol, setProcedimientosPorRol] = useState<{ [rol: string]: string[] }>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [rolActual, setRolActual] = useState<string | null>(null);
  const [procedimientosSeleccionados, setProcedimientosSeleccionados] = useState<string[]>([]);
  const [modalSearch, setModalSearch] = useState(""); // Buscador 
  const [showSugerencias, setShowSugerencias] = useState(false); // Estado para mostrar sugerencias

  // Genera los resultados para el buscador
  const resultadosGenerados = procedimientos
    .filter(
      (p) =>
        p.poe.toLowerCase().includes(modalSearch.toLowerCase()) ||
        p.titulo.toLowerCase().includes(modalSearch.toLowerCase())
    )
    .map((p) => ({
      ...p,
      titulo: p.titulo, // ya existe, pero puedes mapearlo si necesitas
      descripcion: p.titulo, // si tu PoeSearchInput espera 'descripcion'
      codigo: p.poe,
    }));

  // Cuando seleccionas una sugerencia, puedes filtrar directamente
  const handleSelectProcedimiento = (pol: { codigo: string }) => {
    setModalSearch(pol.codigo);
    setShowSugerencias(false);
  };

  // Filtrar roles por búsqueda
  const rolesFiltrados = roles.filter((rol) =>
    rol.toLowerCase().includes(search.toLowerCase())
  );

  // Filtrar procedimientos en el modal por poe o título
  const procedimientosFiltradosModal = procedimientos.filter(
    (p) =>
      p.poe.toLowerCase().includes(modalSearch.toLowerCase()) ||
      p.titulo.toLowerCase().includes(modalSearch.toLowerCase())
  );

  const handleOpenModal = (rol: string) => {
    setRolActual(rol);
    setProcedimientosSeleccionados(procedimientosPorRol[rol] || []);
    setModalSearch("");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setRolActual(null);
    setProcedimientosSeleccionados([]);
    setModalSearch("");
  };

  const handleSaveProcedimientos = () => {
    if (rolActual) {
      setProcedimientosPorRol((prev) => ({
        ...prev,
        [rolActual]: procedimientosSeleccionados,
      }));
    }
    handleCloseModal();
  };


  const columns: TableColumn<string>[] = [
    {
      name: "Rol",
      selector: (rol) => rol,
      sortable: true,
      grow: 2,
    },
    {
      name: "Procedimientos Asignados",
      cell: (rol) =>
        procedimientosPorRol[rol] && procedimientosPorRol[rol].length > 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {procedimientosPorRol[rol].map((poe) => (
              <Chip
                key={poe}
                label={poe}
                size="small"
                color="success"
              />
            ))}
          </Box>
        ) : (
          <span className="text-gray-400">Sin procedimientos</span>
        ),
      grow: 3,
    },
    {
      name: "",
      cell: (rol) => (
        <Tooltip title="Asignar procedimientos" arrow>
          <Button
            onClick={() => handleOpenModal(rol)}
            variant="contained"
            size="small"
            style={{
              backgroundColor: "#2AAC67",
              color: "#fff",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.75rem",
              minWidth: 0,
              padding: "2px 12px",
              borderRadius: "6px",
              boxShadow: "none",
            }}
          >
            Asignar
          </Button>
        </Tooltip>
      ),
      width: "90px",
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];


  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#2AAC67] pb-2">
        Asignar Procedimientos a Roles
      </h1>

      <div className="relative mb-6">

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar procedimientos por código o título..."
        />
      </div>

      <GlobalDataTable
        columns={columns}
        data={rolesFiltrados}
        pagination= {true}
      />

      <GlobalModal
        open={modalOpen}
        onClose={handleCloseModal}
        title={`Asignar procedimientos a ${rolActual}`}
        maxWidth="md"
        actions={
          <>
            <div className="flex justify-center items-center gap-2">
              <SubmitButton
                onClick={handleSaveProcedimientos}
              >
                Guardar
              </SubmitButton>
            </div>
          </>
        }
      >
        <div className="relative mb-4">
          <SearchBar
            value={modalSearch}
            onChange={setModalSearch}
            placeholder="Buscar procedimientos por código o título..."
          />
        </div>
        <ProceduresTableModal
          procedimientos={procedimientosFiltradosModal}
          procedimientosSeleccionados={procedimientosSeleccionados}
          onSeleccionChange={setProcedimientosSeleccionados}
        />
      </GlobalModal>
    </div>
  );
}