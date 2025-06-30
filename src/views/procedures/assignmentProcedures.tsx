import { useRolesProceduresList } from "../../hooks/procedures/useRolesProceduresList";
import {
  Button,
  Box,
  Chip,
  Tooltip,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress"; 
import ProceduresTableModal from "../../components/ProceduresTableModal";
import GlobalModal from "../../components/globalComponents/GlobalModal";
import SubmitButton from "../../components/formComponents/SubmitButton";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import type { TableColumn } from "react-data-table-component";
import SearchBar from "../../components/globalComponents/SearchBarTable";
import FullScreenSpinner from "../../components/globalComponents/FullScreenSpinner";
import SelectField from "../../components/formComponents/SelectField"; 

export default function RolesProcedures() {
  const {
    loading,
    search,
    setSearch,
    rolesFiltrados,
    modalOpen,
    handleOpenModal,
    handleCloseModal,
    rolActual,
    procedimientosSeleccionados,
    setProcedimientosSeleccionados,
    modalSearch,
    setModalSearch,
    procedimientosFiltradosModal,
    handleSaveProcedimientos,
    resetPaginationToggle,
    tipoAsignacion,
    setTipoAsignacion,
    modalLoading, // Agregar el nuevo estado
  } = useRolesProceduresList();

  const columns: TableColumn<any>[] = [
    {
      name: "Rol",
      selector: (rol) => rol.nombre_rol,
      sortable: true,
      grow: 2,
    },
    {
      name: "POE Asignados",
      cell: (rol) =>
        rol.procedimientos && rol.procedimientos.length > 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {rol.procedimientos.map((p: any) => (
              <Chip
                key={p.id_documento}
                label={p.codigo}
                size="small"
                color="success"
                sx={{ borderRadius: 1 }}
              />
            ))}
          </Box>
        ) : (
          <span className="text-gray-400">Sin POE</span>
        ),
      grow: 2,
    },
    {
      name: "Políticas Asignadas",
      cell: (rol) =>
        rol.politicas && rol.politicas.length > 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {rol.politicas.map((p: any) => (
              <Chip
                key={p.id_politica}
                label={p.codigo}
                size="small"
                color="success"
              />
            ))}
          </Box>
        ) : (
          <span className="text-gray-400">Sin políticas</span>
        ),
      grow: 2,
    },
    {
      name: "",
      cell: (rol) => (
        <Tooltip title="Asignar procedimientos/políticas" arrow>
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

  const handleSeleccionChange = (seleccion: string[]) => {
    const numericSeleccion = seleccion.map(Number);
    console.log('🔄 Cambio de selección:', {
      anterior: procedimientosSeleccionados,
      nueva: numericSeleccion
    });
    setProcedimientosSeleccionados(numericSeleccion);
  };

  const handleTipoAsignacionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoAsignacion(e.target.value as "poe" | "politica");
  };

  const opcionesTipoAsignacion = [
    { value: "poe", label: "Procedimientos (POE)" },
    { value: "politica", label: "Políticas" }
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#2AAC67] pb-2">
        Asignar Procedimientos y Políticas a Roles
      </h1>

      <div className="relative mb-6">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar roles por nombre, código POE o número de política..."
        />
      </div>

      {loading ? (
        <FullScreenSpinner />
      ) : (
        <GlobalDataTable
          key={search}
          columns={columns}
          data={rolesFiltrados}
          pagination={true}
          paginationResetDefaultPage={resetPaginationToggle}
        />
      )}

      <GlobalModal
        open={modalOpen}
        onClose={handleCloseModal}
        title={`Asignar ${tipoAsignacion === "poe" ? "procedimientos" : "políticas"} a ${
          rolActual?.nombre_rol || ""
        }`}
        maxWidth="md"
        actions={
          <div className="flex justify-center items-center gap-2">
            <SubmitButton onClick={handleSaveProcedimientos}>
              Guardar Cambios
            </SubmitButton>
          </div>
        }
      >
        <div className="mb-2">
          <SelectField
            label="Tipo de asignación"
            name="tipoAsignacion"
            value={tipoAsignacion}
            onChange={handleTipoAsignacionChange}
            options={opcionesTipoAsignacion}
            optionLabel="label"
            optionValue="value"
          />
        </div>

        <div className="relative mb-4">
          <SearchBar
            value={modalSearch}
            onChange={setModalSearch}
            placeholder={`Buscar ${
              tipoAsignacion === "poe" 
                ? "procedimientos por ID, código POE" 
                : "políticas por ID, número"
            } o descripción...`}
          />
        </div>

        <div style={{ maxHeight: 350, overflowY: "auto" }}>
          {modalLoading ? (
            <div className="flex justify-center items-center py-8">
              <CircularProgress 
                size={40} 
                style={{ color: "#2AAC67" }}
              />
             
            </div>
          ) : (
            <ProceduresTableModal
              procedimientos={procedimientosFiltradosModal}
              procedimientosSeleccionados={procedimientosSeleccionados.map(String)}
              onSeleccionChange={handleSeleccionChange}
              tipo={tipoAsignacion}
            />
          )}
        </div>
      </GlobalModal>
    </div>
  );
}