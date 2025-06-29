import { useProceduresList, type Procedure } from "../../hooks/listProcedure/useProceduresList";
import type { TableColumn } from "react-data-table-component";
import { Edit, Delete, Visibility, Info, Badge, Apartment, Person, CalendarMonth } from "@mui/icons-material";
import React, { useState } from "react";
import TableContainer from "../../components/TableContainer";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import GlobalModal from "../../components/globalComponents/GlobalModal";
import SearchBar from "../../components/globalComponents/SearchBarTable";
import InputField from "../../components/formComponents/InputField";
import SubmitButton from "../../components/formComponents/SubmitButton";
import FullScreenSpinner from "../../components/globalComponents/FullScreenSpinner";
import CustomToaster, { showCustomToast } from "../../components/globalComponents/CustomToaster";
import { useResponsibles } from "../../hooks/procedureFormHooks/useResponsibles";
import PdfInput from "../../components/formComponents/PdfInput";
import { deleteProcedure } from "../../services/procedures/procedureService";

const formatDateToBackend = (dateString: string | Date | undefined): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }
      throw new Error('Fecha inválida');
    }
    return date.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

export default function ListProcedures() {
  const {
    procedures,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    departmentFilter,
    setDepartmentFilter,
    departments,
    updateProcedure,
    fetchProcedures,
  
  } = useProceduresList();

  const { responsibles, loading: loadingResponsibles } = useResponsibles() as { responsibles: Array<{ id_responsable: string; nombre_responsable: string }>, loading: boolean };

  const [showModal, setShowModal] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [procedureToDelete, setProcedureToDelete] = useState<Procedure | null>(null);

  // Edit handler
  const handleEdit = (row: Procedure) => {
    const responsableObj = responsibles.find(r => r.nombre_responsable === row.responsable);
    setEditData({
      ...row,
      descripcion: row.titulo,
      id_responsable: responsableObj ? responsableObj.id_responsable : "",
      path: row.path || row.pdf || "",
      fecha_creacion: row.fecha_creacion?.split("T")[0] || "",
      fecha_vigencia: row.fecha_vigencia?.split("T")[0] || "",
    });
    setEditModalOpen(true);
  };

  // Update handler
  const handleUpdateProcedure = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData) return;
    setSaving(true);
    try {
      if (!editData.descripcion || !editData.id_responsable || !editData.fecha_creacion || !editData.fecha_vigencia) {
        showCustomToast("Todos los campos obligatorios", "", "error");
        setSaving(false);
        return;
      }
      setValidationError(null);
      const result = await updateProcedure({
        id_documento: editData.id_documento,
        descripcion: editData.descripcion,
        id_responsable: editData.id_responsable,
        fecha_creacion: formatDateToBackend(editData.fecha_creacion),
        fecha_vigencia: formatDateToBackend(editData.fecha_vigencia),
        path: editData.path || "",
      });
      if (result.success) {
        showCustomToast("Procedimiento actualizado correctamente", "", "success");
        setEditModalOpen(false);
        setEditData(null);
        await fetchProcedures();
      } else {
        showCustomToast("Error al actualizar el procedimiento", "", "error");
      }
    } catch (err: any) {
      showCustomToast("Error inesperado", err?.message || "", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (row: Procedure) => {
    setProcedureToDelete(row);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!procedureToDelete) return;
    try {
      const res = await deleteProcedure(procedureToDelete.id_documento);
      showCustomToast("Éxito", res.message || "Procedimiento eliminado lógicamente correctamente", "success");
      fetchProcedures();
    } catch (err: any) {
      showCustomToast("Error", err.message || "No se pudo eliminar el procedimiento", "error");
    }
    setDeleteModalOpen(false);
    setProcedureToDelete(null);
  };

  const columns: TableColumn<Procedure>[] = [
    {
      name: "CÓDIGO",
      selector: (row) => row.codigo || "No aplica",
      sortable: true,
      cell: (row) => <div className="text-sm font-medium text-gray-900">{row.codigo || "No aplica"}</div>,
    },
    {
      name: "TÍTULO",
      selector: (row) => row.titulo,
      sortable: true,
      cell: (row) => <div className="text-sm text-gray-700">{row.titulo}</div>,
    },
    {
      name: "DEPARTAMENTO",
      selector: (row) => row.departamento,
      sortable: true,
      cell: (row) => <div className="text-sm text-gray-700">{row.departamento}</div>,
    },
    {
      name: "RESPONSABLE",
      selector: (row) => row.responsable,
      sortable: true,
      cell: (row) => <div className="text-sm text-gray-700">{row.responsable}</div>,
    },
    {
      name: "REVISION",
      selector: (row) => row.revision,
      sortable: true,
    },
    {
      name: "FECHA VIGENCIA",
      selector: (row) => row.fecha_vigencia,
      sortable: true,
      cell: (row) => {
        // Si la fecha viene como "2025-06-29T00:00:00.000Z", toma solo la parte YYYY-MM-DD
        const fecha = row.fecha_vigencia
          ? row.fecha_vigencia.split("T")[0].split("-").reverse().join("/")
          : "";
        return <div className="text-sm text-gray-700">{fecha}</div>;
      },
    },
    {
      name: "ACCIONES",
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <button
            className="action-button text-green-600 hover:text-green-800 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProcedure(row);
              setShowModal(true);
            }}
            title="Ver detalles"
          >
            <Visibility fontSize="small" />
          </button>
          <button
            className="action-button text-green-600 hover:text-green-800 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
            title="Editar"
          >
            <Edit fontSize="small" />
          </button>
          <button
            className="action-button text-red-600 hover:text-red-800 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(row);
            }}
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

  // Antes de paginar, filtra:
const filteredProcedures = procedures.filter((proc) => {
  const matchesSearch = 
    proc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proc.revision.toLowerCase().includes(searchTerm.toLowerCase());
  
  const matchesDepartment = 
    !departmentFilter || 
    proc.departamento === departmentFilter;
  
  return matchesSearch && matchesDepartment;
});
  // Luego, pasa filteredProcedures a la tabla y la paginación.

  if (loading) return <FullScreenSpinner />;
  if (error) {
    showCustomToast("Error al cargar procedimientos", error, "error");
    return null;
  }

  return (
    <>
      <CustomToaster />
      <TableContainer title="Procedimientos de la Empresa">
        <div className="mb-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar procedimientos por título o revisión..."
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-[#2AAC67]"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="">Todos los departamentos</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        <GlobalDataTable
          columns={columns}
          data={filteredProcedures}
          highlightOnHover
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 25, 50, 100]}
          noDataComponent={
            <div className="p-4 text-center text-gray-500">
              No se encontraron procedimientos
            </div>
          }
        />
        {/* Modal de detalles */}
        <GlobalModal
          open={showModal && !!selectedProcedure}
          onClose={() => setShowModal(false)}
          title="Detalles de Procedimiento"
          maxWidth="md"
        >
          {selectedProcedure && (
            <div className="flex flex-col items-center py-2">
              <div className="flex flex-col items-center mb-2">
                <div className="bg-[#e8f8f2] rounded-full w-14 h-14 flex items-center justify-center mb-2">
                  <Info className="text-[#2AAC67]" style={{ fontSize: 36 }} />
                </div>
                <h2 className="text-xl font-bold text-[#2AAC67] mb-1">Detalles de Procedimiento</h2>
              </div>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información del Procedimiento */}
                <div>
                  <h3 className="text-lg font-semibold text-[#2AAC67] mb-3">Información del Procedimiento</h3>
                  <div className="space-y-3">
                    <div className="flex items-center border border-[#2AAC67] rounded-lg px-3 py-2 bg-[#f6fff6]">
                      <Badge className="text-[#2AAC67] mr-2" />
                      <div>
                        <div className="text-xs font-semibold text-[#2AAC67]">Código</div>
                        <div className="text-sm">{selectedProcedure.codigo || "No aplica"}</div>
                      </div>
                    </div>
                    <div className="flex items-center border border-[#2AAC67] rounded-lg px-3 py-2 bg-[#f6fff6]">
                      <Info className="text-[#2AAC67] mr-2" />
                      <div>
                        <div className="text-xs font-semibold text-[#2AAC67]">Título</div>
                        <div className="text-sm">{selectedProcedure.titulo}</div>
                      </div>
                    </div>
                    <div className="flex items-center border border-[#2AAC67] rounded-lg px-3 py-2 bg-[#f6fff6]">
                      <Edit className="text-[#2AAC67] mr-2" />
                      <div>
                        <div className="text-xs font-semibold text-[#2AAC67]">Versión</div>
                        <div className="text-sm">{selectedProcedure.revision}</div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Información Adicional */}
                <div>
                  <h3 className="text-lg font-semibold text-[#2AAC67] mb-3">Información Adicional</h3>
                  <div className="space-y-3">
                    <div className="flex items-center border border-[#2AAC67] rounded-lg px-3 py-2 bg-[#f6fff6]">
                      <Apartment className="text-[#2AAC67] mr-2" />
                      <div>
                        <div className="text-xs font-semibold text-[#2AAC67]">Departamento</div>
                        <div className="text-sm">{selectedProcedure.departamento}</div>
                      </div>
                    </div>
                    <div className="flex items-center border border-[#2AAC67] rounded-lg px-3 py-2 bg-[#f6fff6]">
                      <Person className="text-[#2AAC67] mr-2" />
                      <div>
                        <div className="text-xs font-semibold text-[#2AAC67]">Responsable</div>
                        <div className="text-sm">{selectedProcedure.responsable}</div>
                      </div>
                    </div>
                    <div className="flex items-center border border-[#2AAC67] rounded-lg px-3 py-2 bg-[#f6fff6]">
                      <CalendarMonth className="text-[#2AAC67] mr-2" />
                      <div>
                        <div className="text-xs font-semibold text-[#2AAC67]">Fecha Vigencia</div>
                        <div className="text-sm">
                          {selectedProcedure.fecha_vigencia
                            ? selectedProcedure.fecha_vigencia.split("T")[0].split("-").reverse().join("/")
                            : ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {selectedProcedure.pdf && (
                <div className="pt-6 w-full flex justify-center">
                  <a
                    href={selectedProcedure.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800 hover:underline flex items-center"
                  >
                    Ver documento PDF
                  </a>
                </div>
              )}
            </div>
          )}
        </GlobalModal>
        {/* Modal de edición con mismo estilo visual, pero con los mismos campos de antes */}
        <GlobalModal
          open={editModalOpen}
          onClose={() => !saving && setEditModalOpen(false)}
          title="Editar Procedimiento"
          maxWidth="md"
        >
          {editData && (
            <form className="flex flex-col items-center space-y-6" onSubmit={handleUpdateProcedure}>
              {/* Mensaje de error de validación */}
              {validationError && (
                <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-2 w-full text-center">
                  {validationError}
                </div>
              )}
              <div className="w-full grid grid-cols-1 gap-6">
                <InputField
                  label="Título"
                  name="descripcion"
                  value={editData.descripcion}
                  onChange={e => setEditData({ ...editData, descripcion: e.target.value })}
                  disabled={saving}
                />
                {/* RESPONSABLE COMO SELECT */}
                <div>
                  <label className="block text-[#2AAC67] font-bold mb-1" htmlFor="responsable">Responsable</label>
                  <select
                    id="responsable"
                    name="responsable"
                    value={editData.id_responsable || ""}
                    onChange={e => setEditData({ ...editData, id_responsable: e.target.value })}
                    className="w-full border border-[#2AAC67] rounded-lg bg-[#f6fff6] px-3 py-2 focus:outline-none"
                    disabled={saving || loadingResponsibles}
                  >
                    <option value="">Seleccione responsable</option>
                    {responsibles.map(r => (
                      <option key={r.id_responsable} value={r.id_responsable}>
                        {r.nombre_responsable}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Fecha Creación"
                    name="fecha_creacion"
                    type="date"
                    value={editData.fecha_creacion}
                    onChange={e => setEditData({ ...editData, fecha_creacion: e.target.value })}
                    disabled={saving}
                  />
                  <InputField
                    label="Fecha Vigencia"
                    name="fecha_vigencia"
                    type="date"
                    value={editData.fecha_vigencia}
                    onChange={e => setEditData({ ...editData, fecha_vigencia: e.target.value })}
                    disabled={saving}
                  />
                </div>
                <InputField
                  label="Ruta del Documento"
                  name="path"
                  value={editData.path}
                  onChange={e => setEditData({ ...editData, path: e.target.value })}
                  disabled={true} // <-- Cambia esto a true para que NO se pueda editar
                />
                <PdfInput
                  label="Documento PDF"
                  onChange={file => setEditData({ ...editData, pdf: file })} pdfFile={null} onRemove={function (): void {
                    throw new Error("Function not implemented.");
                  } }                />
              </div>
              <div className="flex justify-end space-x-3 pt-4 w-full">
                <button
                  type="button"
                  onClick={() => !saving && setEditModalOpen(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    saving ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <SubmitButton width="w-40" disabled={saving}>
                  {saving ? "Guardando..." : "Guardar Cambios"}
                </SubmitButton>
              </div>
            </form>
          )}
        </GlobalModal>
        {/* Modal de confirmación de eliminación */}
        <GlobalModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Confirmar eliminación"
        >
          <div className="p-4 text-center">
            <p className="text-sm text-gray-700 mb-4">
              ¿Está seguro que desea eliminar este procedimiento?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </GlobalModal>
      </TableContainer>
    </>
  );
}
