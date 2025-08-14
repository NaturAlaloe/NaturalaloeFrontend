import { useRolesProceduresList } from "../../hooks/procedures/useRolesProceduresList";
import { useRolesPoliticsList } from "../../hooks/procedures/useRolesPoliticsList";
import { useRolesManapolList } from "../../hooks/procedures/useRolesManapolList";
import { RolesProceduresProvider } from "../../hooks/procedures/RolesProceduresContext";
import { Button, Box, Chip, Tooltip, Checkbox, useMediaQuery, useTheme, Select, MenuItem, FormControl, ListItemText, OutlinedInput, } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress"; 
import { useState } from "react";
import {  Visibility } from "@mui/icons-material";
import ProceduresTableModal from "../../components/ProceduresTableModal";
import GlobalModal from "../../components/globalComponents/GlobalModal";
import SubmitButton from "../../components/formComponents/SubmitButton";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import type { TableColumn } from "react-data-table-component";
import SearchBar from "../../components/globalComponents/SearchBarTable";
import FullScreenSpinner from "../../components/globalComponents/FullScreenSpinner";

interface ColumnVisibility {
  rol: boolean;
  poe: boolean;
  politicas: boolean;
  manapol: boolean;
  acciones: boolean;
}

function RolesProceduresContent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Estados para visibilidad de columnas
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    rol: true,
    poe: !isMobile,
    politicas: !isMobile,
    manapol: !isMobile,
    acciones: true,
  });

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

  // Para el select de columnas visibles
  const getVisibleColumns = () => {
    const visibleColumns = [];
    if (columnVisibility.poe) visibleColumns.push('poe');
    if (columnVisibility.politicas) visibleColumns.push('politicas');
    if (columnVisibility.manapol) visibleColumns.push('manapol');
    return visibleColumns;
  };

  const handleSelectChange = (event: any) => {
    const value = event.target.value;
    setColumnVisibility(prev => ({
      ...prev,
      poe: value.includes('poe'),
      politicas: value.includes('politicas'),
      manapol: value.includes('manapol')
    }));
  };

  const allColumns: TableColumn<any>[] = [
    {
      name: "Rol",
      selector: (rol) => rol.nombre_rol,
      sortable: true,
      grow: isMobile ? 3 : 2,
      omit: !columnVisibility.rol,
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
                size={isMobile ? "small" : "small"}
                sx={{ 
                  backgroundColor: "#2AAC67",
                  color: "#fff",
                  borderRadius: 1,
                  fontSize: isMobile ? "0.65rem" : "0.75rem",
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
      grow: isMobile ? 4 : 2,
      omit: !columnVisibility.poe,
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
                size={isMobile ? "small" : "small"}
                variant="outlined"
                sx={{ 
                  borderColor: "#2AAC67",
                  color: "#2AAC67",
                  backgroundColor: "transparent",
                  borderRadius: 1,
                  fontSize: isMobile ? "0.65rem" : "0.75rem",
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
      grow: isMobile ? 4 : 2,
      omit: !columnVisibility.politicas,
    },
    {
      name: "Manapol Asignados",
      cell: (rol) =>
        rol.manapol && rol.manapol.length > 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {rol.manapol.map((m: any) => (
              <Chip
                key={m.id_documento}
                label={m.codigo}
                size={isMobile ? "small" : "small"}
                sx={{ 
                  backgroundColor: "#247349",
                  color: "#fff",
                  borderRadius: 1,
                  fontSize: isMobile ? "0.65rem" : "0.75rem",
                  fontWeight: 500,
                  border: "none",
                  "&:hover": {
                    backgroundColor: "#E55A2B"
                  }
                }}
              />
            ))}
          </Box>
        ) : (
          <span className="text-gray-400">Sin manapol</span>
        ),
      grow: isMobile ? 4 : 2,
      omit: !columnVisibility.manapol,
    },
    {
      name: "Asignar",
      cell: (rol) => (
        <Box sx={{ 
          display: "flex", 
          gap: isMobile ? 0.5 : 1,
          flexDirection: isMobile ? "column" : "row"
        }}>
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
                fontSize: isMobile ? "0.6rem" : "0.7rem",
                minWidth: isMobile ? "70px" : 0,
                padding: isMobile ? "2px 4px" : "4px 8px",
                borderRadius: "4px",
                boxShadow: "none",
              }}
            >
              {isMobile ? "POE" : "Procedimientos"}
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
                fontSize: isMobile ? "0.6rem" : "0.7rem",
                minWidth: isMobile ? "70px" : 0,
                padding: isMobile ? "2px 4px" : "4px 8px",
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
              {isMobile ? "Pol." : "Políticas"}
            </Button>
          </Tooltip>
          <Tooltip title="Asignar Manapol" arrow>
            <Button
              onClick={() => handleOpenModalManapol(rol)}
              variant="contained"
              size="small"
              style={{
                backgroundColor: "#247349",
                color: "#fff",
                textTransform: "none",
                fontWeight: 500,
                fontSize: isMobile ? "0.6rem" : "0.7rem",
                minWidth: isMobile ? "70px" : 0,
                padding: isMobile ? "2px 4px" : "4px 8px",
                borderRadius: "4px",
                boxShadow: "none",
              }}
              sx={{
                "&:hover": {
                  backgroundColor: "#E55A2B"
                }
              }}
            >
              {isMobile ? "Man." : "Manapol"}
            </Button>
          </Tooltip>
        </Box>
      ),
      width: isMobile ? "120px" : "260px",
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      omit: !columnVisibility.acciones,
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#2AAC67] pb-2">
        Asignar Procedimientos, Políticas y Manapol a Roles
      </h1>

      {/* Buscador y selector de columnas */}
      <Box sx={{ 
        display: "flex", 
        gap: 2, 
        mb: 3,
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "stretch" : "center"
      }}>
        <Box sx={{ flex: 1 }}>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar roles por nombre, código POE, política o manapol..."
          />
        </Box>
        
        <FormControl size="small" sx={{ minWidth: isMobile ? "100%" : 200 }}>
          <Select
            multiple
            value={getVisibleColumns()}
            onChange={handleSelectChange}
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if (selected.length === 0) return "Mostrar columnas";
              if (selected.length === 3) return "Mostrar todas";
              return `${selected.length} columnas`;
            }}
            displayEmpty
            startAdornment={
              <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
                <Visibility sx={{ color: "#2AAC67", fontSize: 18 }} />
              </Box>
            }
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e0e0e0',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#2AAC67',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#2AAC67',
              },
            }}
          >
            <MenuItem value="poe">
              <Checkbox 
                checked={columnVisibility.poe}
                sx={{ 
                  color: "#2AAC67",
                  '&.Mui-checked': { color: "#2AAC67" }
                }}
                size="small"
              />
              <ListItemText primary="POE Asignados" />
            </MenuItem>
            <MenuItem value="politicas">
              <Checkbox 
                checked={columnVisibility.politicas}
                sx={{ 
                  color: "#2AAC67",
                  '&.Mui-checked': { color: "#2AAC67" }
                }}
                size="small"
              />
              <ListItemText primary="Políticas Asignadas" />
            </MenuItem>
            <MenuItem value="manapol">
              <Checkbox 
                checked={columnVisibility.manapol}
                sx={{ 
                  color: "#247349",
                  '&.Mui-checked': { color: "#247349" }
                }}
                size="small"
              />
              <ListItemText primary="Manapol Asignados" />
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <FullScreenSpinner />
      ) : (
        <GlobalDataTable
          key={`${search}-${JSON.stringify(columnVisibility)}`}
          columns={allColumns}
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