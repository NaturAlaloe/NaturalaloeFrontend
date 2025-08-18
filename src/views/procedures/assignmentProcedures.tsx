import { useRolesProceduresList } from "../../hooks/procedures/useRolesProceduresList";
import { useRolesPoliticsList } from "../../hooks/procedures/useRolesPoliticsList";
import { useRolesManapolList } from "../../hooks/procedures/useRolesManapolList";
import { RolesProceduresProvider } from "../../hooks/procedures/RolesProceduresContext";
import { Button, Box, Tooltip, useMediaQuery, useTheme, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress"; 
import { useState } from "react";
import ProceduresTableModal from "../../components/ProceduresTableModal";
import GlobalModal from "../../components/globalComponents/GlobalModal";
import SubmitButton from "../../components/formComponents/SubmitButton";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import type { TableColumn } from "react-data-table-component";
import SearchBar from "../../components/globalComponents/SearchBarTable";
import FullScreenSpinner from "../../components/globalComponents/FullScreenSpinner";

function RolesProceduresContent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Estados para modal de vista de documentos
  const [modalVistaOpen, setModalVistaOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [rolSeleccionado, setRolSeleccionado] = useState<any>(null);

  // Nuevo estado para el buscador del modal de vista
  const [modalSearch, setModalSearch] = useState("");

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
    modalLoadingPOE,
    handleSeleccionChangePOE,
    handleSaveProcedimientosWithLoading,
    savingProcedimientos,
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
    modalLoadingPolitics,
    handleSeleccionChangePolitics,
    handleSavePoliticsWithLoading,
    savingPoliticas,
  } = useRolesPoliticsList();

  // Hook para manapol
  const {
    modalManapolOpen,
    handleOpenModalManapol,
    handleCloseModalManapol,
    rolActualManapol,
    manapolSeleccionados,
    modalSearchManapol,
    setModalSearchManapol,
    manapolFiltradosModal,
    modalLoadingManapol,
    handleSeleccionChangeManapol,
    handleSaveManapolWithLoading,
    savingManapol,
  } = useRolesManapolList();

  // Filtrado para cada tab según el buscador
  const procedimientosFiltrados = rolSeleccionado?.procedimientos?.filter(
    (p: any) =>
      p.codigo?.toLowerCase().includes(modalSearch.toLowerCase()) ||
      p.titulo?.toLowerCase().includes(modalSearch.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(modalSearch.toLowerCase())
  ) || [];

  const politicasFiltradas = rolSeleccionado?.politicas?.filter(
    (p: any) =>
      p.codigo?.toLowerCase().includes(modalSearch.toLowerCase()) ||
      p.titulo?.toLowerCase().includes(modalSearch.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(modalSearch.toLowerCase())
  ) || [];

  const manapolFiltrados = rolSeleccionado?.manapol?.filter(
    (m: any) =>
      (m.codigo_rm || m.codigo)?.toLowerCase().includes(modalSearch.toLowerCase()) ||
      m.titulo?.toLowerCase().includes(modalSearch.toLowerCase()) ||
      m.descripcion?.toLowerCase().includes(modalSearch.toLowerCase())
  ) || [];

  // Función para abrir modal de vista
  const handleOpenModalVista = (rol: any) => {
    setRolSeleccionado(rol);
    setModalVistaOpen(true);
    setTabValue(0);
  };

  const handleCloseModalVista = () => {
    setModalVistaOpen(false);
    setRolSeleccionado(null);
    setTabValue(0);
  };

  const allColumns: TableColumn<any>[] = [
    {
      name: "Rol",
      selector: (rol) => rol.nombre_rol,
      sortable: true,
      grow: 3,
    },
    {
      name: "Asignar",
      cell: (rol) => (
        <Box sx={{ 
          display: "flex", 
          gap: 1,
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center"
        }}>
          <Tooltip title="Asignar procedimientos POE" arrow>
            <Button
              onClick={() => handleOpenModalPOE(rol)}
              variant="contained"
              size="small"
              sx={{
                backgroundColor: "#2AAC67",
                color: "#fff",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.75rem",
                minWidth: "90px",
                padding: "6px 12px",
                borderRadius: "6px",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#22965a"
                }
              }}
            >
              POE
            </Button>
          </Tooltip>
          
          <Tooltip title="Asignar políticas" arrow>
            <Button
              onClick={() => handleOpenModalPolitics(rol)}
              variant="outlined"
              size="small"
              sx={{
                borderColor: "#2AAC67",
                color: "#2AAC67",
                backgroundColor: "transparent",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.75rem",
                minWidth: "90px",
                padding: "6px 12px",
                borderRadius: "6px",
                boxShadow: "none",
                borderWidth: "2px",
                "&:hover": {
                  borderColor: "#22965a",
                  color: "#22965a",
                  backgroundColor: "rgba(42, 172, 103, 0.08)"
                }
              }}
            >
              Políticas
            </Button>
          </Tooltip>

          <Tooltip title="Asignar registro maestro" arrow>
            <Button
              onClick={() => handleOpenModalManapol(rol)}
              variant="contained"
              size="small"
              sx={{
                backgroundColor: "#247349",
                color: "#fff",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.75rem",
                minWidth: "90px",
                padding: "6px 12px",
                borderRadius: "6px",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#1a5c37"
                }
              }}
            >
              Registro Maestro
            </Button>
          </Tooltip>
        </Box>
      ),
      width: isMobile ? "200px" : "300px",
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Acciones",
      cell: (rol) => (
        <Box sx={{ 
          display: "flex", 
          justifyContent: "center",
          alignItems: "center"
        }}>
          <Tooltip title="Ver documentos asignados" arrow>
            <Button
              onClick={() => handleOpenModalVista(rol)}
              variant="outlined"
              size="small"
              sx={{
                borderColor: "#6B7280",
                color: "#6B7280",
                backgroundColor: "transparent",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.75rem",
                minWidth: "90px",
                padding: "6px 12px",
                borderRadius: "6px",
                boxShadow: "none",
                borderWidth: "2px",
                "&:hover": {
                  borderColor: "#374151",
                  color: "#374151",
                  backgroundColor: "rgba(107, 114, 128, 0.08)"
                }
              }}
            >
              Ver
            </Button>
          </Tooltip>
        </Box>
      ),
      width: "120px",
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#2AAC67] pb-2">
        Asignar Procedimientos, Políticas y Registro Maestro a Roles
      </h1>

      {/* Buscador */}
      <Box sx={{ mb: 3 }}>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar roles por nombre..."
        />
      </Box>

      {loading ? (
        <FullScreenSpinner />
      ) : (
        <GlobalDataTable
          key={search}
          columns={allColumns}
          data={rolesFiltrados}
          pagination={true}
          paginationResetDefaultPage={resetPaginationToggle}
        />
      )}

      {/* Modal para Ver Documentos Asignados */}
      <GlobalModal
        open={modalVistaOpen}
        onClose={handleCloseModalVista}
        title={`Documentos asignados al rol: ${rolSeleccionado?.nombre_rol || ""}`}
        maxWidth="md"
      >
        <Box sx={{ width: "100%", p: 1 }}>
          {/* Buscador */}
          <Box sx={{ mb: 2 }}>
            <SearchBar
              value={modalSearch}
              onChange={setModalSearch}
              placeholder="Buscar por código o título..."
            />
          </Box>

          {/* Botones tipo tabs */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Button
              variant={tabValue === 0 ? "contained" : "outlined"}
              onClick={() => setTabValue(0)}
              sx={{
                flex: 1,
                backgroundColor: tabValue === 0 ? "#2AAC67" : undefined,
                color: tabValue === 0 ? "#fff" : "#2AAC67",
                borderColor: "#2AAC67",
                fontWeight: 600,
                fontSize: "1rem",
                borderRadius: "6px",
                boxShadow: "none",
                textTransform: "none",
              }}
            >
              POE
            </Button>
            <Button
              variant={tabValue === 1 ? "contained" : "outlined"}
              onClick={() => setTabValue(1)}
              sx={{
                flex: 1,
                backgroundColor: tabValue === 1 ? "#2AAC67" : undefined,
                color: tabValue === 1 ? "#fff" : "#2AAC67",
                borderColor: "#2AAC67",
                fontWeight: 600,
                fontSize: "1rem",
                borderRadius: "6px",
                boxShadow: "none",
                textTransform: "none",
              }}
            >
              Políticas
            </Button>
            <Button
              variant={tabValue === 2 ? "contained" : "outlined"}
              onClick={() => setTabValue(2)}
              sx={{
                flex: 1,
                backgroundColor: tabValue === 2 ? "#2AAC67" : undefined,
                color: tabValue === 2 ? "#fff" : "#2AAC67",
                borderColor: "#247349",
                fontWeight: 600,
                fontSize: "1rem",
                borderRadius: "6px",
                boxShadow: "none",
                textTransform: "none",
              }}
            >
              Registro Maestro
            </Button>
          </Box>

          {/* Tabla según tab */}
          {tabValue === 0 && (
            <Paper sx={{ border: "2px solid #e0e0e0", borderRadius: "8px", overflow: "hidden" }}>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ backgroundColor: "#2AAC67", color: "#fff", fontWeight: 700 }}>Código POE</TableCell>
                      <TableCell sx={{ backgroundColor: "#2AAC67", color: "#fff", fontWeight: 700 }}>Título</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {procedimientosFiltrados.length > 0 ? procedimientosFiltrados.map((poe: any) => (
                      <TableRow key={poe.id_documento}>
                        <TableCell>{poe.codigo}</TableCell>
                        <TableCell>{poe.titulo || poe.descripcion || 'Sin título'}</TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={2} align="center">No hay procedimientos POE</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {tabValue === 1 && (
            <Paper sx={{ border: "2px solid #e0e0e0", borderRadius: "8px", overflow: "hidden" }}>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ backgroundColor: "#2AAC67", color: "#fff", fontWeight: 700 }}>Código</TableCell>
                      <TableCell sx={{ backgroundColor: "#2AAC67", color: "#fff", fontWeight: 700 }}>Título</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {politicasFiltradas.length > 0 ? politicasFiltradas.map((p: any) => (
                      <TableRow key={p.id_documento}>
                        <TableCell>{p.codigo}</TableCell>
                        <TableCell>{p.titulo || p.descripcion || 'Sin título'}</TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={2} align="center">No hay políticas</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {tabValue === 2 && (
            <Paper sx={{ border: "2px solid #e0e0e0", borderRadius: "8px", overflow: "hidden" }}>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ backgroundColor: "#2AAC67", color: "#fff", fontWeight: 700 }}>Código RM</TableCell>
                      <TableCell sx={{ backgroundColor: "#2AAC67", color: "#fff", fontWeight: 700 }}>Título</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {manapolFiltrados.length > 0 ? manapolFiltrados.map((m: any) => (
                      <TableRow key={m.id_documento}>
                        <TableCell>{m.codigo_rm || m.codigo}</TableCell>
                        <TableCell>{m.descripcion || m.titulo || 'Sin descripción'}</TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={2} align="center">No hay Registros Maestros</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Box>
      </GlobalModal>

      {/* Modales existentes para asignación */}
      {/* Modal para POE */}
      <GlobalModal
        open={modalPOEOpen}
        onClose={handleCloseModalPOE}
        title={`Asignar procedimientos (POE) a ${rolActualPOE?.nombre_rol || ""}`}
        maxWidth="md"
        actions={
          <div className="flex justify-center items-center gap-2">
            <SubmitButton onClick={handleSaveProcedimientosWithLoading} loading={savingProcedimientos}>
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
            <SubmitButton onClick={handleSavePoliticsWithLoading} loading={savingPoliticas}>
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

      {/* Modal para Manapol */}
      <GlobalModal
        open={modalManapolOpen}
        onClose={handleCloseModalManapol}
        title={`Asignar Registro Maestro a ${rolActualManapol?.nombre_rol || ""}`}
        maxWidth="md"
        actions={
          <div className="flex justify-center items-center gap-1">
            <SubmitButton 
              onClick={handleSaveManapolWithLoading} 
              loading={savingManapol}
              style={{ backgroundColor: "#2AAC67" }}
            >
              Guardar Registro Maestro
            </SubmitButton>
          </div>
        }
      >
        <div className="relative mb-2">
          <SearchBar
            value={modalSearchManapol}
            onChange={setModalSearchManapol}
            placeholder="Buscar registro maestro por ID, código o descripción..."
          />
        </div>

        <div style={{ maxHeight: 350, overflowY: "auto" }}>
          {modalLoadingManapol ? (
            <div className="flex justify-center items-center py-8">
              <CircularProgress 
                size={40} 
                style={{ color: "#2AAC67" }}
              />
              <span className="ml-3 text-gray-600">Cargando manapol...</span>
            </div>
          ) : (
            <ProceduresTableModal
              procedimientos={
                [...manapolFiltradosModal].sort((a, b) => {
                  const codigoA = a.codigo_rm || a.codigo;
                  const codigoB = b.codigo_rm || b.codigo;
                  
                  const aNum = Number(codigoA?.replace(/[^\d]/g, ''));
                  const bNum = Number(codigoB?.replace(/[^\d]/g, ''));
                  
                  if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
                  return (codigoA || '').localeCompare(codigoB || '');
                })
              }
              procedimientosSeleccionados={manapolSeleccionados}
              onSeleccionChange={handleSeleccionChangeManapol}
              tipo="manapol"
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