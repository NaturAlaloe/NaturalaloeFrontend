import { useRolesProceduresList } from "../../hooks/procedures/useRolesProceduresList";
import { useRolesProcedures } from "../../hooks/procedures/useRolesProcedures"; // Importa el hook real
import {
  Button,
  Box,
  Chip,
  Tooltip,
} from "@mui/material";
import ProceduresTableModal from "../../components/ProceduresTableModal";
import GlobalModal from "../../components/globalComponents/GlobalModal";
import SubmitButton from "../../components/formComponents/SubmitButton";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import type { TableColumn } from "react-data-table-component";
import SearchBar from "../../components/globalComponents/SearchBarTable";
import FullScreenSpinner from "../../components/globalComponents/FullScreenSpinner";
import React from "react";

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
  } = useRolesProceduresList();

  const { saveProcedures, removeProcedures } = useRolesProcedures();

  const columns: TableColumn<any>[] = [
    {
      name: "Rol",
      selector: (rol) => rol.nombre_rol,
      sortable: true,
      grow: 2,
    },
    {
      name: "Procedimientos Asignados",
      cell: (rol) =>
        rol.procedimientos && rol.procedimientos.length > 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {rol.procedimientos.map((p: any) => (
              <Chip
                key={p.id_documento}
                label={p.codigo}
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

  // Guarda la selección anterior en un ref para comparar
  const prevSeleccionRef = React.useRef<number[]>(procedimientosSeleccionados);

  // Nueva función para manejar el cambio de selección
  const handleSeleccionChange = (seleccion: number[]) => {
    const prevSeleccion = prevSeleccionRef.current;
    const nuevos = seleccion.filter(id => !prevSeleccion.includes(id));
    const quitados = prevSeleccion.filter(id => !seleccion.includes(id));

    if (rolActual) {
      if (nuevos.length > 0) {
        saveProcedures(rolActual.id_rol, nuevos);
      }
      if (quitados.length > 0) {
        removeProcedures(rolActual.id_rol, quitados);
      }
    }
    setProcedimientosSeleccionados(seleccion);
    prevSeleccionRef.current = seleccion;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
       
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#2AAC67] pb-2">
        Asignar Procedimientos a Roles
      </h1>

      <div className="relative mb-6">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar roles por nombre..."
        />
      </div>

      {loading ? (
        <FullScreenSpinner />
      ) : (
        <GlobalDataTable
          columns={columns}
          data={rolesFiltrados}
          pagination={true}
        />
      )}

      <GlobalModal
        open={modalOpen}
        onClose={handleCloseModal}
        title={`Asignar procedimientos a ${rolActual?.nombre_rol || ""}`}
        maxWidth="md"
        actions={
          <div className="flex justify-center items-center gap-2">
            <SubmitButton onClick={handleSaveProcedimientos}>
              Guardar
            </SubmitButton>
          </div>
        }
      >
        <div className="relative mb-4">
          <SearchBar
            value={modalSearch}
            onChange={setModalSearch}
            placeholder="Buscar procedimientos por código o descripción..."
          />
        </div>
        <div style={{ maxHeight: 350, overflowY: "auto" }}>
          <ProceduresTableModal
            procedimientos={procedimientosFiltradosModal}
            procedimientosSeleccionados={procedimientosSeleccionados.map(String)}
            onSeleccionChange={seleccion =>
              handleSeleccionChange(seleccion.map(Number))
            }
          />
        </div>
      </GlobalModal>
    </div>
  );
}