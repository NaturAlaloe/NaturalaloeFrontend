import TableContainer from "../../components/TableContainer";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import GlobalModal from "../../components/globalComponents/GlobalModal";
import SubmitButton from "../../components/formComponents/SubmitButton";
import InputField from "../../components/formComponents/InputField";
import SearchBar from "../../components/globalComponents/SearchBarTable";
import { Edit, Delete } from "@mui/icons-material";
import { useAreasList } from '../../hooks/manage/useAreasList';
import FullScreenSpinner from "../../components/globalComponents/FullScreenSpinner";

export default function AreasList() {
  const ui = useAreasList();

  const columns = [
    {
      name: "Área",
      selector: (row: { titulo: string }) => row.titulo,
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row: any, idx: number) => (
        <div className="flex gap-2">
          <button
            className="text-[#2AAC67] hover:text-green-700"
            onClick={() => ui.handleOpenEdit(row)} // Pasa el área, no el índice
            title="Editar"
          >
            <Edit fontSize="small" />
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => ui.handleOpenDelete(row)}
            title="Eliminar"
          >
            <Delete fontSize="small" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <TableContainer title="Áreas">
      {ui.loading && <FullScreenSpinner />}
      <div className="flex items-center justify-between mb-4">
        <SearchBar
          value={ui.search}
          onChange={ui.setSearch}
          placeholder="Buscar área..."
          className="w-full mr-4"
        />
        <SubmitButton
          className="px-3 py-2 text-base rounded-lg flex items-center justify-center"
          width="w-10"
          type="button"
          onClick={ui.handleOpenAdd}
          style={{ minWidth: "40px", minHeight: "40px", padding: 0 }}
        >
          <span className="text-xl leading-none">+</span>
        </SubmitButton>
      </div>
      <GlobalDataTable
        columns={columns}
        data={ui.filteredAreas}
        rowsPerPage={5}
        progressPending={ui.loading}
      />

      <GlobalModal
        open={ui.modalOpen}
        onClose={() => {
          ui.setModalOpen(false);
          ui.setEditAreaObj(null);
        }}
        title={ui.editAreaObj ? "Editar Área" : "Agregar Área"}
        maxWidth="sm"
      >
        <form
          onSubmit={ui.handleSave}
          className="flex flex-col gap-4 min-w-[250px]"
        >
          <InputField
            label="Nombre del Área"
            name="area"
            value={ui.areaInput}
            onChange={(e) => ui.setAreaInput(e.target.value)}
            required
          />

          <SubmitButton>
            {ui.editAreaObj ? "Guardar Cambios" : "Agregar"}
          </SubmitButton>
        </form>
      </GlobalModal>

      <GlobalModal
        open={ui.deleteAreaObj !== null}
        onClose={() => ui.setDeleteAreaObj(null)}
        title="Eliminar Área"
        maxWidth="sm"
        actions={
          <div className="flex gap-2">
            <SubmitButton
              className="bg-gray-400 hover:bg-gray-500"
              type="button"
              onClick={() => ui.setDeleteAreaObj(null)}
            >
              Cancelar
            </SubmitButton>
            <SubmitButton
              className="bg-red-500 hover:bg-red-600"
              type="button"
              onClick={ui.handleDelete}
            >
              Eliminar
            </SubmitButton>
          </div>
        }
      >
        <div>¿Estás seguro de que deseas eliminar esta área?</div>
      </GlobalModal>
      {ui.error && (
        <div className="text-red-500 mt-2 text-center">{ui.error}</div>
      )}
    </TableContainer>
  );
}