import TableContainer from "../../components/TableContainer";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import GlobalModal from "../../components/globalComponents/GlobalModal";
import SubmitButton from "../../components/formComponents/SubmitButton";
import InputField from "../../components/formComponents/InputField";
import SelectField from "../../components/formComponents/SelectField";
import SearchBar from "../../components/globalComponents/SearchBarTable";
import { Edit, Delete } from "@mui/icons-material";
import FullScreenSpinner from "../../components/globalComponents/FullScreenSpinner";
import { useDepartmentsList } from "../../hooks/manage/useDepartamentsList";

export default function DepartmentsList() {
  const {
    areas,
    loading,
    loadingAreas,
    error,
    search,
    setSearch,
    modalOpen,
    setModalOpen,
    editIndex,
    setEditIndex,
    deleteIndex,
    setDeleteIndex,
    departmentInput,
    setDepartmentInput,
    areaInput,
    setAreaInput,
    codigoInput,
    setCodigoInput,
    filteredDepartments,
    handleOpenAdd,
    handleOpenEdit,
    handleSave,
    handleDelete,
  } = useDepartmentsList();

  const columns = [
    { name: "Código", selector: (row: any) => row.codigo_departamento, sortable: true },
    { name: "Departamento", selector: (row: any) => row.titulo_departamento, sortable: true },
    { name: "Área", selector: (row: any) => row.titulo_area, sortable: true },
    {
      name: "Acciones",
      cell: (_: any, idx: number) => (
        <div className="flex gap-2">
          <button
            className="text-[#2AAC67] hover:text-green-700"
            onClick={() => handleOpenEdit(idx)}
            title="Editar"
          >
            <Edit fontSize="small" />
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => setDeleteIndex(idx)}
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
    <TableContainer title="Departamentos">
      {(loading || loadingAreas) && <FullScreenSpinner />}
      <div className="flex items-center justify-between mb-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar por código, departamento o área..."
           className=" w-full mr-4"
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
        data={filteredDepartments}
        rowsPerPage={5}
        progressPending={loading}
      />

      <GlobalModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditIndex(null);
        }}
        title={editIndex !== null ? "Editar Departamento" : "Agregar Departamento"}
        maxWidth="sm"
      >
        <form
          onSubmit={handleSave}
          className="flex flex-col gap-4 min-w-[250px]"
        >
          <InputField
            label="Código"
            name="codigo"
            type="number"
            value={codigoInput}
            onChange={(e) => setCodigoInput(e.target.value ? Number(e.target.value) : "")}
            required
          />
          <InputField
            label="Nombre del Departamento"
            name="department"
            value={departmentInput}
            onChange={(e) => setDepartmentInput(e.target.value)}
            required
          />
          <SelectField
            label="Área"
            name="area"
            value={areaInput}
            onChange={(e) => setAreaInput(e.target.value ? Number(e.target.value) : "")}
            options={areas}
            optionLabel="titulo"
            optionValue="id_area"
            required
            disabled={loadingAreas}
          />
          <SubmitButton>
            {editIndex !== null ? "Guardar Cambios" : "Agregar"}
          </SubmitButton>
        </form>
      </GlobalModal>


      <GlobalModal
        open={deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
        title="Eliminar Departamento"
        maxWidth="sm"
        actions={
          <div className="flex gap-2">
            <SubmitButton
              className="bg-gray-400 hover:bg-gray-500"
              type="button"
              onClick={() => setDeleteIndex(null)}
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
        <div>¿Estás seguro de que deseas eliminar este departamento?</div>
      </GlobalModal>
      {error && (
        <div className="text-red-500 mt-2 text-center">{error}</div>
      )}
    </TableContainer>
  );
}