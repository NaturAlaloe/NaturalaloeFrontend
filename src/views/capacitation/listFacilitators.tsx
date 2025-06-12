import { useState } from "react";
import { Edit, Delete, Search } from "@mui/icons-material";
import { useFacilitadoresList, type Facilitador } from "../../hooks/capacitations/useListFacilitators";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import GlobalModal from "../../components/globalComponents/GlobalModal";
import InputField from "../../components/formComponents/InputField";
import SelectField from "../../components/formComponents/SelectField";

export default function ListFacilitadores() {
  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    filtered,
    paginated,
    totalPages,
    updateFacilitador,
  } = useFacilitadoresList();

  const [showEditModal, setShowEditModal] = useState(false);
  const [facilitadorEditando, setFacilitadorEditando] = useState<Facilitador | null>(null);

  const handleEditClick = (facilitador: Facilitador, e: React.MouseEvent) => {
    e.stopPropagation();
    setFacilitadorEditando({ ...facilitador });
    setShowEditModal(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!facilitadorEditando) return;
    setFacilitadorEditando({
      ...facilitadorEditando,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveEdit = () => {
    if (!facilitadorEditando) return;
    updateFacilitador(facilitadorEditando);
    setShowEditModal(false);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setFacilitadorEditando(null);
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("¿Desea eliminar este facilitador?")) {
      alert("Eliminar no implementado (solo visual)");
    }
  };

  const columns = [
    { name: "NOMBRE", selector: (row: Facilitador) => row.nombre, sortable: true },
    { name: "APELLIDO", selector: (row: Facilitador) => row.apellido, sortable: true },
    { name: "TIPO DE FACILITADOR", selector: (row: Facilitador) => row.tipo, sortable: true },
    {
      name: "ACCIONES",
      cell: (row: Facilitador) => (
        <div className="flex items-center space-x-2">
          <button className="text-[#2AAC67]" onClick={(e) => handleEditClick(row, e)}>
            <Edit fontSize="small" />
          </button>
          <button className="text-[#F44336]" onClick={(e) => handleDelete(row.id, e)}>
            <Delete fontSize="small" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const CustomPagination = () => (
    <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between w-full">
        <p className="text-sm text-gray-700">
          Mostrando {" "}
          <span className="font-medium">{(currentPage - 1) * rowsPerPage + 1}</span> a {" "}
          <span className="font-medium">{Math.min(currentPage * rowsPerPage, filtered.length)}</span> de {" "}
          <span className="font-medium">{filtered.length}</span> resultados
        </p>
        <div>
          <nav className="inline-flex rounded-md shadow-sm -space-x-px">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}
              className="px-2 py-2 border text-sm text-gray-500 bg-white hover:bg-gray-100 rounded-l-md">
              ◀
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button key={idx + 1}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-4 py-2 border text-sm ${
                  currentPage === idx + 1 ? 'bg-gray-300 text-gray-900 font-bold' : 'text-gray-600 hover:bg-gray-100'
                }`}>
                {idx + 1}
              </button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
              className="px-2 py-2 border text-sm text-gray-500 bg-white hover:bg-gray-100 rounded-r-md">
              ▶
            </button>
          </nav>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#2AAC67] pb-2">
        Facilitadores
      </h1>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre, apellido o tipo..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-[#2AAC67] sm:text-sm"
        />
      </div>

      <GlobalDataTable
        columns={columns}
        data={paginated}
        pagination={false}
        highlightOnHover
        dense
      />
      <CustomPagination />

      {showEditModal && facilitadorEditando && (
        <GlobalModal
          open={showEditModal}
          onClose={handleCancelEdit}
          title="Editar Facilitador"
          actions={
            <>
              <button onClick={handleCancelEdit} className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100">
                Cancelar
              </button>
              <button onClick={handleSaveEdit} className="px-4 py-2 rounded-md bg-[#2AAC67] text-white hover:bg-[#259e5d]">
                Guardar
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <InputField
              label="Nombre"
              name="nombre"
              value={facilitadorEditando.nombre}
              onChange={handleEditChange}
              placeholder="Nombre del facilitador"
            />
            <InputField
              label="Apellido"
              name="apellido"
              value={facilitadorEditando.apellido}
              onChange={handleEditChange}
              placeholder="Apellido del facilitador"
            />
            <SelectField
              label="Tipo de Facilitador"
              name="tipo"
              value={facilitadorEditando.tipo}
              onChange={handleEditChange}
              options={["Interno", "Externo"]}
            />
          </div>
        </GlobalModal>
      )}
    </div>
  );
}
