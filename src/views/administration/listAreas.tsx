import React, { useState } from "react";
import TableContainer from "../../components/TableContainer";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import GlobalModal from "../../components/globalComponents/GlobalModal";
import SubmitButton from "../../components/formComponents/SubmitButton";
import InputField from "../../components/formComponents/InputField";
import SearchBar from "../../components/globalComponents/SearchBarTable";
import { Edit, Delete } from "@mui/icons-material";
import { useAreas } from "../../hooks/useAreas";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

export default function AreasList() {
  const {
    areas,
    loading,
    error,
    addArea,
  } = useAreas();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [areaInput, setAreaInput] = useState("");
  const [areaPadreInput, setAreaPadreInput] = useState<number | undefined>(undefined);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // Filtrar áreas según búsqueda
  const filteredAreas = Array.isArray(areas)
    ? areas.filter((a) => a.titulo.toLowerCase().includes(search.toLowerCase()))
    : [];

  // Abrir modal para agregar
  const handleOpenAdd = () => {
    setEditIndex(null);
    setAreaInput("");
    setAreaPadreInput(undefined);
    setModalOpen(true);
  };

  // Abrir modal para editar
  const handleOpenEdit = (idx: number) => {
    setEditIndex(idx);
    setAreaInput(filteredAreas[idx].titulo);
    setModalOpen(true);
  };

  // Guardar área (agregar o editar)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (areaInput.trim() === "") return;
    if (editIndex !== null) {
      setModalOpen(false);
    } else {
      try {
        await addArea({
          titulo: areaInput,
          id_area_padre: areaPadreInput ?? undefined,
        });
        showCustomToast("Éxito", "Área agregada correctamente", "success");
        setModalOpen(false);
        setAreaInput("");
        setAreaPadreInput(undefined);
      } catch (err) {
        showCustomToast("Error", "Error al agregar área", "error");
      }
    }
  };

  const handleDelete = () => {
    setDeleteIndex(null);
  };

  const columns = [
    {
      name: "Área",
      selector: (row: { titulo: string }) => row.titulo,
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (_: { titulo: string }, idx: number) => (
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
    <TableContainer title="Áreas">
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex-1 flex items-center">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar área..."
            className="mb-0"
          />
        </div>
        <SubmitButton
          className="ml-2 px-3 py-2 text-base rounded-lg flex items-center justify-center"
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
        data={filteredAreas}
        rowsPerPage={5}
        progressPending={loading}
      />

      {/* Modal para agregar/editar */}
      <GlobalModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editIndex !== null ? "Editar Área" : "Agregar Área"}
        maxWidth="sm"
      >
        <form
          onSubmit={handleSave}
          className="flex flex-col gap-4 min-w-[250px]"
        >
          <InputField
            label="Nombre del Área"
            name="area"
            value={areaInput}
            onChange={(e) => setAreaInput(e.target.value)}
            required
          />
       
          <SubmitButton>
            {editIndex !== null ? "Guardar Cambios" : "Agregar"}
          </SubmitButton>
        </form>
      </GlobalModal>

      {/* Modal de confirmación para eliminar */}
      <GlobalModal
        open={deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
        title="Eliminar Área"
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
        <div>¿Estás seguro de que deseas eliminar esta área?</div>
      </GlobalModal>
      {error && (
        <div className="text-red-500 mt-2 text-center">{error}</div>
      )}
    </TableContainer>
  );
}