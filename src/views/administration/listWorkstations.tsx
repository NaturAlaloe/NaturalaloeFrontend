import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import TableContainer from "../../components/TableContainer";
import FullScreenSpinner from "../../components/globalComponents/FullScreenSpinner";
import GlobalModal from "../../components/globalComponents/GlobalModal";
import SubmitButton from "../../components/formComponents/SubmitButton";
import InputField from "../../components/formComponents/InputField";
import SelectField from "../../components/formComponents/SelectField";
import SearchBar from "../../components/globalComponents/SearchBarTable";
import { Edit, Delete } from "@mui/icons-material";
import { useWorkstationsList } from "../../hooks/manage/useWorkstationsList";
import { useDepartments } from "../../hooks/manage/useDepartments";

export default function ListWorkstations() {
  const {
    loading,
    error,
    search,
    setSearch,
    modalOpen,
    setModalOpen,
    editIndex,
    setEditIndex,
    deleteIndex,
    setDeleteIndex,
    editWorkstation,
    setEditWorkstation,
    deleteWorkstation,
    setDeleteWorkstation,
    workstationInput,
    setWorkstationInput,
    departmentInput,
    setDepartmentInput,
    filteredWorkstations,
    handleOpenAdd,
    handleOpenEdit,
    handleSave,
    handleDelete,
  } = useWorkstationsList();

  const {
    departments,
    loading: loadingDepartments,
  } = useDepartments();

  const columns = [
    { name: "Puesto", selector: (row: any) => row.titulo_puesto, sortable: true },
    { name: "Departamento", selector: (row: any) => row.titulo_departamento, sortable: true },
    {
      name: "Acciones",
      cell: (row: any) => (
        <div className="flex gap-2">
          <button
            className="text-[#2AAC67] hover:text-green-700"
            onClick={() => handleOpenEdit(row)}
            title="Editar"
          >
            <Edit fontSize="small" />
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => setDeleteWorkstation(row)}
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
    <TableContainer title="Puestos de Trabajo">
      {loading && <FullScreenSpinner />}
      <div className="flex items-center justify-between mb-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar por puesto o departamento..."
          className="w-full mr-4"
        />
        <SubmitButton
          className="px-3 py-2 text-base rounded-lg flex items-center justify-center"
          width="w-10"
          type="button"
          onClick={handleOpenAdd}
          style={{ minWidth: "40px", minHeight: "40px", padding: 0 }}
        >
          <span className="text-xl leading-none">+</span>
        </SubmitButton>
      </div>
      <GlobalDataTable
        columns={columns}
        data={filteredWorkstations}
        rowsPerPage={5}
        progressPending={loading}
      />

      <GlobalModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditIndex(null);
        }}
        title={editIndex !== null ? "Editar Puesto" : "Agregar Puesto"}
        maxWidth="sm"
      >
        <form
          onSubmit={handleSave}
          className="flex flex-col gap-4 min-w-[250px]"
        >
          <InputField
            label="Nombre del Puesto"
            name="workstation"
            value={workstationInput}
            onChange={(e) => setWorkstationInput(e.target.value)}
            required
          />
          <SelectField
            label="Departamento"
            name="department"
            value={departmentInput}
            onChange={(e) => setDepartmentInput(e.target.value) }
            options={departments}
            optionLabel="titulo_departamento"
            optionValue="id_departamento"
            required
            disabled={loadingDepartments}
          />

          <SubmitButton>
            {editIndex !== null ? "Guardar Cambios" : "Agregar"}
          </SubmitButton>
        </form>
      </GlobalModal>

      <GlobalModal
        open={!!deleteWorkstation}
        onClose={() => setDeleteWorkstation(null)}
        title="Eliminar Puesto"
        maxWidth="sm"
        actions={
          <div className="flex gap-2">
            <SubmitButton
              className="bg-gray-400 hover:bg-gray-500"
              type="button"
              onClick={() => setDeleteWorkstation(null)}
            >
              Cancelar
            </SubmitButton>
            <SubmitButton
              className="bg-red-500 hover:bg-red-600"
              type="button"
              onClick={handleDelete}
            >
              Eliminar
            </SubmitButton>
          </div>
        }
      >
        <div>¿Estás seguro de que deseas eliminar este puesto?</div>
      </GlobalModal>
      {error && (
        <div className="text-red-500 mt-2 text-center">{error}</div>
      )}
    </TableContainer>
  );
}