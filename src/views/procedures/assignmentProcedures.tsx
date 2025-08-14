import { useRolesProceduresList } from "../../hooks/procedures/useRolesProceduresList";
import { useRolesPoliticsList } from "../../hooks/procedures/useRolesPoliticsList";
import { useRolesManapolList } from "../../hooks/procedures/useRolesManapolList";
import { RolesProceduresProvider } from "../../hooks/procedures/RolesProceduresContext";
import { Button, Box, Chip, Tooltip, useMediaQuery, useTheme, Typography, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
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

          <Tooltip title="Asignar manapol" arrow>
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
              Manapol
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
        Asignar Procedimientos, Políticas y Manapol a Roles
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
        maxWidth="lg"
      >
        <Box sx={{ width: "100%", p: 1 }}>
          <Tabs 
            value={tabValue} 
            onChange={(_e, newValue) => setTabValue(newValue)}
            sx={{
              mb: 3,
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                minWidth: "auto",
                px: 4,
                py: 2,
                mr: 1,
                borderRadius: "8px 8px 0 0",
                color: "#6B7280",
                "&.Mui-selected": {
                  color: "#fff",
                  backgroundColor: "#2AAC67",
                },
              },
              "& .MuiTabs-indicator": {
                display: "none",
              },
            }}
          >
            <Tab label={`POE (${rolSeleccionado?.procedimientos?.length || 0})`} />
            <Tab label={`Políticas (${rolSeleccionado?.politicas?.length || 0})`} />
            <Tab label={`Manapol (${rolSeleccionado?.manapol?.length || 0})`} />
          </Tabs>

          {/* Tab POE */}
          {tabValue === 0 && (
            <Box sx={{ backgroundColor: "#2AAC67", borderRadius: "0 12px 12px 12px", p: 0, overflow: "hidden" }}>
              <Box sx={{ backgroundColor: "#fff", m: 0 }}>
                {rolSeleccionado?.procedimientos && rolSeleccionado.procedimientos.length > 0 ? (
                  <Paper sx={{ border: "2px solid rgb(224, 224, 224)", borderRadius: "8px", overflow: "hidden" }}>
                    <TableContainer sx={{ maxHeight: 400 }}>
                      <Table stickyHeader size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ 
                              backgroundColor: "#2AAC67", 
                              color: "#fff", 
                              fontWeight: 700, 
                              fontSize: "0.9rem",
                            }}>
                              Código POE
                            </TableCell>
                            <TableCell sx={{ 
                              backgroundColor: "#2AAC67", 
                              color: "#fff", 
                              fontWeight: 700, 
                              fontSize: "0.9rem",
                            }}>
                              Título del Procedimiento
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rolSeleccionado.procedimientos.map((poe: any, index: number) => (
                            <TableRow 
                              key={poe.id_documento} 
                              sx={{ 
                                "&:hover": { backgroundColor: "#f8fffe" },
                                backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                                borderBottom: "1px solid #e0e0e0"
                              }}
                            >
                              <TableCell sx={{ py: 2, borderRight: "1px solid #e0e0e0" }}>
                                <Box sx={{
                                  backgroundColor: "#2AAC67",
                                  color: "#fff",
                                  fontSize: "0.8rem",
                                  fontWeight: 600,
                                  minWidth: "80px",
                                  textAlign: "center",
                                  padding: "6px 12px",
                                  borderRadius: "4px",
                                  border: "1px solid #1e7d4d",
                                  display: "inline-block"
                                }}>
                                  {poe.codigo}
                                </Box>
                              </TableCell>
                              <TableCell sx={{ py: 2, fontSize: "0.9rem" }}>
                                {poe.titulo || poe.descripcion || 'Sin título disponible'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                ) : (
                  <Box sx={{ 
                    textAlign: "center", 
                    py: 8, 
                    color: "#6B7280",
                    border: "2px dashed #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9"
                  }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                      Sin procedimientos POE
                    </Typography>
                    <Typography variant="body2">
                      Este rol no tiene procedimientos POE asignados
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}

          {/* Tab Políticas */}
          {tabValue === 1 && (
            <Box sx={{ backgroundColor: "#2AAC67", borderRadius: "0 12px 12px 12px", p: 0, overflow: "hidden" }}>
              <Box sx={{ backgroundColor: "#fff", m: 0 }}>
                {rolSeleccionado?.politicas && rolSeleccionado.politicas.length > 0 ? (
                  <Paper sx={{ border: "2px solid #e0e0e0", borderRadius: "8px", overflow: "hidden" }}>
                    <TableContainer sx={{ maxHeight: 400 }}>
                      <Table stickyHeader size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ 
                              backgroundColor: "#2AAC67", 
                              color: "#fff", 
                              fontWeight: 700, 
                              fontSize: "0.9rem",
                              borderBottom: "2px solid #1e7d4d"
                            }}>
                              Código de Política
                            </TableCell>
                            <TableCell sx={{ 
                              backgroundColor: "#2AAC67", 
                              color: "#fff", 
                              fontWeight: 700, 
                              fontSize: "0.9rem",
                              borderBottom: "2px solid #1e7d4d"
                            }}>
                              Título de la Política
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rolSeleccionado.politicas.map((politica: any, index: number) => (
                            <TableRow 
                              key={politica.id_documento} 
                              sx={{ 
                                "&:hover": { backgroundColor: "#f8fffe" },
                                backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                                borderBottom: "1px solid #e0e0e0"
                              }}
                            >
                              <TableCell sx={{ py: 2, borderRight: "1px solid #e0e0e0" }}>
                                <Box sx={{
                                  borderColor: "#2AAC67",
                                  color: "#2AAC67",
                                  fontSize: "0.8rem",
                                  fontWeight: 600,
                                  minWidth: "80px",
                                  textAlign: "center",
                                  padding: "6px 12px",
                                  borderRadius: "4px",
                                  border: "2px solid #2AAC67",
                                  backgroundColor: "transparent",
                                  display: "inline-block"
                                }}>
                                  {politica.codigo}
                                </Box>
                              </TableCell>
                              <TableCell sx={{ py: 2, fontSize: "0.9rem" }}>
                                {politica.titulo || politica.descripcion || 'Sin título disponible'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                ) : (
                  <Box sx={{ 
                    textAlign: "center", 
                    py: 8, 
                    color: "#6B7280",
                    border: "2px dashed #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9"
                  }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                      Sin políticas
                    </Typography>
                    <Typography variant="body2">
                      Este rol no tiene políticas asignadas
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}

          {/* Tab Manapol */}
          {tabValue === 2 && (
            <Box sx={{ backgroundColor: "#247349", borderRadius: "0 12px 12px 12px", p: 0, overflow: "hidden" }}>
              <Box sx={{ backgroundColor: "#fff", m: 0 }}>
                {rolSeleccionado?.manapol && rolSeleccionado.manapol.length > 0 ? (
                  <Paper sx={{ border: "2px solid #e0e0e0", borderRadius: "8px", overflow: "hidden" }}>
                    <TableContainer sx={{ maxHeight: 400 }}>
                      <Table stickyHeader size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ 
                              backgroundColor: "#247349", 
                              color: "#fff", 
                              fontWeight: 700, 
                              fontSize: "0.9rem",
                              borderBottom: "2px solid #1a5c37"
                            }}>
                              Código Manapol
                            </TableCell>
                            <TableCell sx={{ 
                              backgroundColor: "#247349", 
                              color: "#fff", 
                              fontWeight: 700, 
                              fontSize: "0.9rem",
                              borderBottom: "2px solid #1a5c37"
                            }}>
                              Descripción del Manapol
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rolSeleccionado.manapol.map((manapol: any, index: number) => (
                            <TableRow 
                              key={manapol.id_documento} 
                              sx={{ 
                                "&:hover": { backgroundColor: "#f8fff8" },
                                backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                                borderBottom: "1px solid #e0e0e0"
                              }}
                            >
                              <TableCell sx={{ py: 2, borderRight: "1px solid #e0e0e0" }}>
                                <Box sx={{
                                  backgroundColor: "#247349",
                                  color: "#fff",
                                  fontSize: "0.8rem",
                                  fontWeight: 600,
                                  minWidth: "80px",
                                  textAlign: "center",
                                  padding: "6px 12px",
                                  borderRadius: "4px",
                                  border: "1px solid #1a5c37",
                                  display: "inline-block"
                                }}>
                                  {manapol.codigo_rm || manapol.codigo}
                                </Box>
                              </TableCell>
                              <TableCell sx={{ py: 2, fontSize: "0.9rem" }}>
                                {manapol.descripcion || manapol.titulo || 'Sin descripción disponible'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                ) : (
                  <Box sx={{ 
                    textAlign: "center", 
                    py: 8, 
                    color: "#6B7280",
                    border: "2px dashed #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9"
                  }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                      Sin manapol
                    </Typography>
                    <Typography variant="body2">
                      Este rol no tiene manapol asignados
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
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
        title={`Asignar manapol a ${rolActualManapol?.nombre_rol || ""}`}
        maxWidth="md"
        actions={
          <div className="flex justify-center items-center gap-1">
            <SubmitButton 
              onClick={handleSaveManapolWithLoading} 
              loading={savingManapol}
              style={{ backgroundColor: "#247349" }}
            >
              Guardar Manapol
            </SubmitButton>
          </div>
        }
      >
        <div className="relative mb-2">
          <SearchBar
            value={modalSearchManapol}
            onChange={setModalSearchManapol}
            placeholder="Buscar manapol por ID, código o descripción..."
          />
        </div>

        <div style={{ maxHeight: 350, overflowY: "auto" }}>
          {modalLoadingManapol ? (
            <div className="flex justify-center items-center py-8">
              <CircularProgress 
                size={40} 
                style={{ color: "#247349" }}
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