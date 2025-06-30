import { Edit, Delete, Search } from "@mui/icons-material";
import { useFacilitadores } from "../../hooks/capacitations/useListFacilitators";
import type { Facilitador } from "../../services/listFacilitatorService";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import GlobalModal from "../../components/globalComponents/GlobalModal";
import InputField from "../../components/formComponents/InputField";
import TableContainer from "../../components/TableContainer";
import FullScreenSpinner from "../../components/globalComponents/FullScreenSpinner";

export default function ListFacilitadores() {
  const {
    searchTerm,
    setSearchTerm,
    filtered,
    showEditModal,
    facilitadorEditando,
    handleEditClick,
    handleEditChange,
    handleSaveEdit,
    handleCancelEdit,
    showDeleteModal,
    facilitadorAEliminar,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    loading, 
  } = useFacilitadores();

  if (loading) return <FullScreenSpinner />;

  const columns = [
    { name: "NOMBRE", selector: (row: Facilitador) => row.nombre, sortable: true },
    { name: "PRIMER APELLIDO", selector: (row: Facilitador) => row.apellido1, sortable: true },
    { name: "SEGUNDO APELLIDO", selector: (row: Facilitador) => row.apellido2, sortable: true },
    { name: "TIPO DE FACILITADOR", selector: (row: Facilitador) => row.tipo_facilitador, sortable: true },
    {
      name: "ACCIONES",
      cell: (row: Facilitador) => (
        <div className="flex items-center space-x-2">
          <button type="button" className="text-[#2AAC67]" onClick={(e) => handleEditClick(row, e)}>
            <Edit fontSize="small" />
          </button>
          <button type="button" className="text-[#F44336]" onClick={(e) => handleDeleteClick(row, e)}>
            <Delete fontSize="small" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <TableContainer title="Lista de Facilitadores">
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre, apellido o tipo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-[#2AAC67] sm:text-sm"
        />
      </div>

      <GlobalDataTable columns={columns} data={filtered} pagination highlightOnHover dense />

      {showEditModal && facilitadorEditando && (
        <GlobalModal open={showEditModal} onClose={handleCancelEdit} title="Editar Facilitador" maxWidth="sm">
          <form onSubmit={handleSaveEdit}>
            <div className="space-y-4">
              <InputField label="Nombre" name="nombre" value={facilitadorEditando.nombre} onChange={handleEditChange} required />
              <InputField label="Primer Apellido" name="apellido1" value={facilitadorEditando.apellido1} onChange={handleEditChange} required />
              <InputField label="Segundo Apellido" name="apellido2" value={facilitadorEditando.apellido2} onChange={handleEditChange} required />
            </div>
            <div className="flex justify-center gap-2 mt-6">
              <button type="button" onClick={handleCancelEdit} className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100">
                Cancelar
              </button>
              <button type="submit" className="px-4 py-2 rounded-md bg-[#2AAC67] text-white hover:bg-[#259e5d]">
                Guardar
              </button>
            </div>
          </form>
        </GlobalModal>
      )}

      {showDeleteModal && facilitadorAEliminar && (
        <GlobalModal
          open={showDeleteModal}
          onClose={handleCancelDelete}
          title="Confirmar eliminación"
          maxWidth="sm"
          actions={
            <>
              <button onClick={handleCancelDelete} className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100">
                Cancelar
              </button>
              <button onClick={handleConfirmDelete} className="px-4 py-2 rounded-md bg-[#F44336] text-white hover:bg-red-600">
                Eliminar
              </button>
            </>
          }
        >
          <p className="text-sm text-gray-700">
            ¿Estás seguro de eliminar al facilitador <strong>{facilitadorAEliminar.nombre} {facilitadorAEliminar.apellido1} {facilitadorAEliminar.apellido2}</strong>?
          </p>
        </GlobalModal>
      )}
    </TableContainer>
  );
}
