import { useRolesProceduresList } from "../../hooks/procedures/useRolesProceduresList";
import { useRolesPoliticsList } from "../../hooks/procedures/useRolesPoliticsList";
import { RolesProceduresProvider } from "../../hooks/procedures/RolesProceduresContext";
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

function RolesProceduresContent() {
  // Hook para procedimientos (POE)
  const {
    loading,
    search,
    setSearch,
    rolesFiltrados,
    resetPaginationToggle,
    modalPOEOpen,
    handleOpenModalPOE,
    handleCloseModalPOE,
    rolActualPOE,
    procedimientosSeleccionados,
    modalSearchPOE,
    setModalSearchPOE,
    procedimientosFiltradosModal,
    handleSaveProcedimientos,
    modalLoadingPOE,
    handleSeleccionChangePOE,
  } = useRolesProceduresList();

  // Hook para políticas
  const {
    modalPoliticsOpen,
    handleOpenModalPolitics,
    handleCloseModalPolitics,
    rolActualPolitics,
    politicasSeleccionadas,
    modalSearchPolitics,
    setModalSearchPolitics,
    politicasFiltradosModal,
    handleSavePolitics,
    modalLoadingPolitics,
    handleSeleccionChangePolitics,
  } = useRolesPoliticsList();

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
                sx={{ 
                  backgroundColor: "#2AAC67",
                  color: "#fff",
                  borderRadius: 1,
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  border: "none",
                  "&:hover": {
                    backgroundColor: "#22965a"
                  }
                }}
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
                key={p.id_documento}
                label={p.codigo}
                size="small"
                variant="outlined"
                sx={{ 
                  borderColor: "#2AAC67",
                  color: "#2AAC67",
                  backgroundColor: "transparent",
                  borderRadius: 1,
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  borderWidth: "1.5px",
                  "&:hover": {
                    borderColor: "#22965a",
                    color: "#22965a",
                    backgroundColor: "rgba(42, 172, 103, 0.04)"
                  }
                }}
              />
            ))}
          </Box>
        ) : (
          <span className="text-gray-400">Sin políticas</span>
        ),
      grow: 2,
    },
    {
      name: "Asignar",
      cell: (rol) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Asignar POE" arrow>
            <Button
              onClick={() => handleOpenModalPOE(rol)}
              variant="contained"
              size="small"
              style={{
                backgroundColor: "#2AAC67",
                color: "#fff",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.7rem",
                minWidth: 0,
                padding: "4px 8px",
                borderRadius: "4px",
                boxShadow: "none",
              }}
            >
              Procedimientos
            </Button>
          </Tooltip>
          <Tooltip title="Asignar Políticas" arrow>
            <Button
              onClick={() => handleOpenModalPolitics(rol)}
              variant="outlined"
              size="small"
              style={{
                borderColor: "#2AAC67",
                color: "#2AAC67",
                backgroundColor: "transparent",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.7rem",
                minWidth: 0,
                padding: "4px 8px",
                borderRadius: "4px",
                boxShadow: "none",
                borderWidth: "1.5px",
              }}
              sx={{
                "&:hover": {
                  borderColor: "#22965a",
                  color: "#22965a",
                  backgroundColor: "rgba(42, 172, 103, 0.04)"
                }
              }}
            >
              Políticas
            </Button>
          </Tooltip>
        </Box>
      ),
      width: "180px",
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
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

      {/* Modal para POE */}
      <GlobalModal
        open={modalPOEOpen}
        onClose={handleCloseModalPOE}
        title={`Asignar procedimientos (POE) a ${rolActualPOE?.nombre_rol || ""}`}
        maxWidth="md"
        actions={
          <div className="flex justify-center items-center gap-2">
            <SubmitButton onClick={handleSaveProcedimientos}>
              Guardar Procedimientos
            </SubmitButton>
          </div>
        }
      >
        <div className="relative mb-4">
          <SearchBar
            value={modalSearchPOE}
            onChange={setModalSearchPOE}
            placeholder="Buscar procedimientos por ID, código POE o descripción..."
          />
        </div>

        <div style={{ maxHeight: 350, overflowY: "auto" }}>
          {modalLoadingPOE ? (
            <div className="flex justify-center items-center py-8">
              <CircularProgress 
                size={40} 
                style={{ color: "#2AAC67" }}
              />
              <span className="ml-3 text-gray-600">Cargando procedimientos...</span>
            </div>
          ) : (
            <ProceduresTableModal
              procedimientos={
                [...procedimientosFiltradosModal].sort(
                  (a, b) => {
                    // Ordenar por número de POE (codigo), numérico si es posible
                    const aNum = Number(a.codigo);
                    const bNum = Number(b.codigo);
                    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
                    return (a.codigo || '').localeCompare(b.codigo || '');
                  }
                )
              }
              procedimientosSeleccionados={procedimientosSeleccionados.map(String)}
              onSeleccionChange={handleSeleccionChangePOE}
              tipo="poe"
            />
          )}
        </div>
      </GlobalModal>

      {/* Modal para Políticas */}
      <GlobalModal
        open={modalPoliticsOpen}
        onClose={handleCloseModalPolitics}
        title={`Asignar políticas a ${rolActualPolitics?.nombre_rol || ""}`}
        maxWidth="md"
        actions={
          <div className="flex justify-center items-center gap-1">
            <SubmitButton onClick={handleSavePolitics}>
              Guardar Políticas
            </SubmitButton>
          </div>
        }
      >
        <div className="relative mb-2">
          <SearchBar
            value={modalSearchPolitics}
            onChange={setModalSearchPolitics}
            placeholder="Buscar políticas por ID, número o descripción..."
          />
        </div>

        <div style={{ maxHeight: 350, overflowY: "auto" }}>
          {modalLoadingPolitics ? (
            <div className="flex justify-center items-center py-8">
              <CircularProgress 
                size={40} 
                style={{ color: "#2AAC67" }}
              />
              <span className="ml-3 text-gray-600">Cargando políticas...</span>
            </div>
          ) : (
            <ProceduresTableModal
              procedimientos={
                [...politicasFiltradosModal].sort(
                  (a, b) => {
                    // Ordenar por número de política (numero_politica), numérico si es posible
                    const aNum = Number(a.numero_politica ?? a.codigo);
                    const bNum = Number(b.numero_politica ?? b.codigo);
                    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
                    return (a.numero_politica || a.codigo || '').localeCompare(b.numero_politica || b.codigo || '');
                  }
                )
              }
              procedimientosSeleccionados={politicasSeleccionadas.map(String)}
              onSeleccionChange={handleSeleccionChangePolitics}
              tipo="politica"
            />
          )}
        </div>
      </GlobalModal>
    </div>
  );
}

export default function RolesProcedures() {
  return (
    <RolesProceduresProvider>
      <RolesProceduresContent />
    </RolesProceduresProvider>
  );
}