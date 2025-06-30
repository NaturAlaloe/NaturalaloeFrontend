import { Edit, Delete, Search, Add } from "@mui/icons-material";
import { useState } from "react";
import { useGenerales } from "../../hooks/trainings/useGeneralList";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import GlobalModal from "../../components/globalComponents/GlobalModal";
import InputField from "../../components/formComponents/InputField";
import TableContainer from "../../components/TableContainer";
import FullScreenSpinner from "../../components/globalComponents/FullScreenSpinner";

export default function ListCapacitationGeneral() {
  const {
    generales,
    modalOpen,
    editing,
    selected,
    deleteModalOpen,
    loading,
    setEditing,
    openAdd,
    setCurrentPage,
    currentPage,
    openEdit,
    openDelete,
    closeModal,
    closeDeleteModal,
    updateGeneral,
    deleteGeneral,
  } = useGenerales();

  const [searchTerm, setSearchTerm] = useState("");

  
  const filtered = generales.filter((item) => {
    const codigo = (item.codigo ?? "").toLowerCase().trim();
    const titulo = (item.titulo ?? "").toLowerCase().trim();
    const search = searchTerm.toLowerCase().trim();
    return codigo.includes(search) || titulo.includes(search);
  });

  if (loading) return <FullScreenSpinner />;

  const columns = [
    { name: "CÓDIGO", selector: (row: any) => row.codigo, sortable: true },
    { name: "TÍTULO", selector: (row: any) => row.titulo, sortable: true },
    {
      name: "ACCIONES",
      cell: (row: any) => (
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="text-[#2AAC67]"
            onClick={() => openEdit(row)}
          >
            <Edit fontSize="small" />
          </button>
          <button
            type="button"
            className="text-[#F44336]"
            onClick={() => openDelete(row)}
          >
            <Delete fontSize="small" />
          </button>
        </div>
      ),
      right: true,
    },
  ];

  return (
    <TableContainer title="Lista de Generales">
      <div className="relative mb-6 flex items-center space-x-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por código o título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-[#2AAC67] sm:text-sm"
          />
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-white bg-[#2AAC67] hover:bg-[#259e5d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2AAC67]"
          aria-label="Agregar general"
          title="Agregar general"
        >
          <Add fontSize="small" />
        </button>
      </div>

      <GlobalDataTable
        columns={columns}
        data={filtered}
        pagination 
        highlightOnHover
        dense
        currentPage={currentPage}
        onChangePage={setCurrentPage}
      />

      {/* Modal Agregar/Editar */}
      {modalOpen && editing && (
        <GlobalModal
          open={modalOpen}
          onClose={closeModal}
          title={editing.id === 0 ? "Agregar General" : "Editar General"}
          maxWidth="sm"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateGeneral(editing);
            }}
          >
            <div className="space-y-4">
              <InputField
                label="Código"
                name="codigo"
                value={editing.codigo}
                onChange={(e) => setEditing({ ...editing, codigo: e.target.value })}
                required
              />
              <InputField
                label="Título"
                name="titulo"
                value={editing.titulo}
                onChange={(e) => setEditing({ ...editing, titulo: e.target.value })}
                required
              />
            </div>
            <div className="flex justify-center gap-2 mt-6">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-[#2AAC67] text-white hover:bg-[#259e5d]"
              >
                Guardar
              </button>
            </div>
          </form>
        </GlobalModal>
      )}

      {/* Modal Eliminar */}
      {deleteModalOpen && selected && (
        <GlobalModal
          open={deleteModalOpen}
          onClose={closeDeleteModal}
          title="¿Eliminar General?"
          maxWidth="sm"
          actions={
            <>
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteGeneral(selected.id)}
                className="px-4 py-2 rounded-md bg-[#F44336] text-white hover:bg-red-600"
              >
                Eliminar
              </button>
            </>
          }
        >
          <p className="text-gray-800 text-center">
            ¿Estás seguro que deseas eliminar el general <strong>{selected.titulo}</strong> con código <strong>{selected.codigo}</strong>?
          </p>
        </GlobalModal>
      )}
    </TableContainer>
  );
}