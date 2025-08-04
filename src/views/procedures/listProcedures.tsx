import TableContainer from "../../components/TableContainer";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import SearchBar from "../../components/globalComponents/SearchBarTable";
import FullScreenSpinner from "../../components/globalComponents/FullScreenSpinner";
import CustomToaster, {
  showCustomToast,
} from "../../components/globalComponents/CustomToaster";
import GlobalModal from "../../components/globalComponents/GlobalModal";
import FormContainer from "../../components/formComponents/FormContainer";
import InputField from "../../components/formComponents/InputField";
import SelectField from "../../components/formComponents/SelectField";
import StyledCheckbox from "../../components/formComponents/StyledCheckbox";
import SubmitButton from "../../components/formComponents/SubmitButton";
import PdfInput from "../../components/formComponents/PdfInput";

// Hooks
import { useVersionedProceduresController } from "../../hooks/listProcedure/useVersionedProceduresController";
import { useVersionedTableColumns } from "../../hooks/listProcedure/useVersionedTableColumns";

export default function ListProcedures() {
  const controller = useVersionedProceduresController();

  // Columnas con manejo de versiones
  const columns = useVersionedTableColumns({
    onEdit: controller.handleEdit,
    onViewPdf: controller.handleViewPdf,
    selectedRevision: controller.selectedRevision,
    onVersionChange: controller.handleVersionChange,
    getSelectedVersionData: controller.getSelectedVersionData,
    handleAskObsolete: controller.handleAskObsolete,
    procedureFilter: controller.procedureFilter, // Pasamos el filtro
  });

  if (controller.loading) return <FullScreenSpinner />;
  if (controller.error) {
    showCustomToast(
      "Error de conexión",
      "No se pudieron cargar los procedimientos. Verifique su conexión e intente nuevamente",
      "error"
    );
    return null;
  }

  return (
    <>
      <CustomToaster />
      <TableContainer title="Procedimientos de la Empresa">
      <div className="flex items-center justify-between mb-4 gap-4">
        

          <SearchBar
            value={controller.searchTerm}
            onChange={controller.setSearchTerm}
            placeholder={`Buscar ${controller.procedureFilter === 'active' ? 'procedimientos activos' : 'procedimientos obsoletos'} por título o código...`}
            className="flex-1"
          />
            <div className="flex items-center gap-2">
           
           <select
             className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-transparent min-w-[180px]"
             value={controller.procedureFilter}
             onChange={(e) => controller.handleFilterChange(e.target.value as 'active' | 'obsolete')}
           >
             <option value="active">Procedimientos Activos</option>
             <option value="obsolete">Procedimientos Obsoletos</option>
           </select>
         </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Departamento
          </label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-[#2AAC67]"
            value={controller.departmentFilter}
            onChange={(e) => controller.setDepartmentFilter(e.target.value)}
          >
            <option value="">Todos los departamentos</option>
            {controller.departments.map((dept: string) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <GlobalDataTable
          columns={columns}
          data={controller.procedures}
          highlightOnHover
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 25, 50, 100]}
          currentPage={controller.currentPage}
          onChangePage={controller.setCurrentPage}
          noDataComponent={
            <div className="p-4 text-center text-gray-500">
              {controller.procedureFilter === 'active' 
                ? "No se encontraron procedimientos activos"
                : "No se encontraron procedimientos obsoletos"
              }
            </div>
          }
        />

        {/* Modal de Edición - solo para procedimientos activos */}
        {controller.procedureFilter === 'active' && (
          <GlobalModal
            open={controller.editModal.isOpen}
            onClose={controller.editModal.onClose}
            title={
              controller.editModal.data?.es_nueva_version
                ? "Crear Nueva Versión del Procedimiento"
                : "Editar Procedimiento"
            }
            maxWidth="lg"
            backgroundColor="#DDF6E8"
          >
            {controller.editModal.data && (
              <FormContainer
                title={
                  controller.editModal.data.es_nueva_version
                    ? "Crear Nueva Versión"
                    : "Editar Procedimiento"
                }
                onSubmit={controller.editModal.onSubmit}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Información cuando es nueva versión */}
                  {controller.editModal.data.es_nueva_version && (
                    <div className="md:col-span-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Creando Nueva Versión
                      </h4>
                      <p className="text-gray-700 text-sm">
                        Se creará una nueva versión del procedimiento{" "}
                        <strong>{controller.editModal.data.codigo}</strong>. Si
                        marca esta versión como vigente, todas las versiones
                        anteriores se desactivarán automáticamente.
                      </p>
                    </div>
                  )}

                  {/* Checkbox para nueva versión */}
                  <StyledCheckbox
                    label="¿Es una nueva versión?"
                    checked={controller.editModal.data.es_nueva_version || false}
                    onChange={(checked) =>
                      controller.editModal.handlers.handleCheckboxChange(
                        "es_nueva_version",
                        checked
                      )
                    }
                  />

                  <StyledCheckbox
                    label="¿Es Vigente?"
                    checked={controller.editModal.data.es_vigente || false}
                    onChange={(checked) =>
                      controller.editModal.handlers.handleCheckboxChange(
                        "es_vigente",
                        checked
                      )
                    }
                  />

                  {/* CAMPOS DE SOLO LECTURA */}
                  <InputField
                    label="Código POE"
                    name="codigo_poe"
                    value={controller.editModal.data.codigo || "No aplica"}
                    readOnly
                    disabled
                  />

                  <InputField
                    label="Fecha de Creación"
                    name="fecha_creacion"
                    type="date"
                    value={controller.editModal.data.fecha_creacion}
                    readOnly
                    disabled
                  />

                  <InputField
                    label="Departamento"
                    name="departamento"
                    value={
                      controller.editModal.data.departamento || "No especificado"
                    }
                    readOnly
                    disabled
                  />

                  <InputField
                    label="Categoría"
                    name="categoria"
                    value={
                      controller.editModal.data.categoria || "No especificada"
                    }
                    readOnly
                    disabled
                  />

                  {/* CAMPOS EDITABLES */}
                  <InputField
                    label="Título"
                    name="descripcion"
                    value={controller.editModal.data.descripcion}
                    onChange={(e) =>
                      controller.editModal.handlers.handleInputChange(
                        "descripcion",
                        e.target.value
                      )
                    }
                    placeholder="Ingrese título"
                    required
                    disabled={controller.editModal.saving}
                  />

                  <SelectField
                    label="Responsable"
                    name="responsable"
                    value={controller.editModal.data.id_responsable || ""}
                    onChange={(e) =>
                      controller.editModal.handlers.handleInputChange(
                        "id_responsable",
                        e.target.value
                      )
                    }
                    options={controller.editModal.responsibles}
                    optionLabel="nombre_responsable"
                    optionValue="id_responsable"
                    disabled={
                      controller.editModal.saving ||
                      controller.editModal.loadingResponsibles
                    }
                    required
                  />

                  <InputField
                    label="Revisión"
                    name="revision"
                    type="number"
                    min="0"
                    step="1"
                    value={controller.editModal.data.revision || ""}
                    onChange={(e) =>
                      controller.editModal.handlers.handleInputChange(
                        "revision",
                        e.target.value
                      )
                    }
                    placeholder="0"
                    required
                    disabled={controller.editModal.saving}
                  />

                  <InputField
                    label="Fecha de Vigencia"
                    name="fecha_vigencia"
                    type="date"
                    value={controller.editModal.data.fecha_vigencia}
                    onChange={(e) =>
                      controller.editModal.handlers.handleInputChange(
                        "fecha_vigencia",
                        e.target.value
                      )
                    }
                    required
                    disabled={controller.editModal.saving}
                  />

                  <div className="md:col-span-2">
                    <PdfInput
                      label={
                        controller.editModal.data.es_nueva_version
                          ? "Documento PDF (Opcional - Nueva versión)"
                          : "Documento PDF (Opcional - Solo para actualizar)"
                      }
                      pdfFile={controller.editModal.data.pdf || null}
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        controller.editModal.handlers.handleFileChange(file);
                      }}
                      onRemove={() =>
                        controller.editModal.handlers.handleFileChange(null)
                      }
                    />

                    {/* Aviso específico para nueva versión */}
                    {controller.editModal.data.es_nueva_version &&
                      !controller.editModal.data.pdf && (
                        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="text-sm text-yellow-700">
                            💡 <strong>Información:</strong> Se creará la nueva
                            versión sin documento PDF asociado.
                          </p>
                          <p className="text-xs text-yellow-600 mt-1">
                            Puede agregar un PDF ahora o subirlo más tarde
                            editando esta versión.
                          </p>
                        </div>
                      )}

                    {controller.editModal.data?.path ? (
                      <div className="mt-2 p-2 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">
                          <strong>PDF actual:</strong>
                          <button
                            type="button"
                            onClick={() => {
                              if (controller.editModal.data?.path) {
                                window.open(
                                  controller.editModal.data.path,
                                  "_blank"
                                );
                              }
                            }}
                            className="ml-2 text-[#2AAC67] hover:text-[#228B55] underline"
                          >
                            Ver PDF actual
                          </button>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Selecciona un nuevo archivo solo si deseas reemplazarlo
                        </p>
                      </div>
                    ) : !controller.editModal.data.es_nueva_version && (
                      <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded">
                        <p className="text-sm text-orange-700">
                          ⚠️ <strong>Sin documento PDF:</strong> Esta versión del
                          procedimiento no tiene un documento PDF asociado.
                        </p>
                        <p className="text-xs text-orange-600 mt-1">
                          Puede subir un archivo PDF nuevo usando el selector de
                          archivos arriba.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center mt-8">
                  <SubmitButton
                    width="w-40"
                    loading={controller.editModal.saving}
                    disabled={controller.editModal.saving}
                  >
                    {controller.editModal.saving
                      ? (controller.editModal.data.es_nueva_version ? "Creando Versión..." : "Actualizando...")
                      : (controller.editModal.data.es_nueva_version ? "Crear Nueva Versión" : "Guardar Cambios")
                    }
                  </SubmitButton>
                </div>
              </FormContainer>
            )}
          </GlobalModal>
        )}

        {/* Modal de confirmación para obsolescencia/reactivación */}
        <GlobalModal
          open={controller.obsoleteModal.open}
          onClose={() =>
            controller.setObsoleteModal({ open: false, id: undefined })
          }
          title={controller.procedureFilter === 'active' ? "Marcar como obsoleto" : "Reactivar procedimiento"}
          maxWidth="sm"
          actions={
            <div className="flex gap-2">
              <SubmitButton
                className="bg-gray-400 hover:bg-gray-500"
                type="button"
                onClick={() =>
                  controller.setObsoleteModal({ open: false, id: undefined })
                }
              >
                Cancelar
              </SubmitButton>
              <SubmitButton
                className={controller.procedureFilter === 'active' 
                  ? "bg-red-500 hover:bg-red-600" 
                  : "bg-[#2BAC67] hover:bg-green-700"
                }
                type="button"
                onClick={controller.handleAskReason}
              >
                {controller.procedureFilter === 'active' ? "Continuar" : "Continuar"}
              </SubmitButton>
            </div>
          }
        >
          <div className="text-center ">
            {controller.procedureFilter === 'active' 
              ? "¿Estás seguro de que deseas marcar este procedimiento como obsoleto?"
              : "¿Estás seguro de que deseas reactivar este procedimiento?"
            }
          </div>
        </GlobalModal>

        {/* Modal para razón de obsolescencia o reactivación */}
        <GlobalModal
          open={controller.reasonModal}
          onClose={() => controller.setReasonModal(false)}
          title={controller.procedureFilter === 'active' ? "Razón de obsolescencia" : "Razón de reactivación"}
          maxWidth="sm"
          actions={
            <div className="flex gap-2">
              <SubmitButton
                className="bg-gray-400 hover:bg-gray-500"
                type="button"
                onClick={() => controller.setReasonModal(false)}
                disabled={controller.obsoleteLoading}
              >
                Cancelar
              </SubmitButton>
              <SubmitButton
                className={controller.procedureFilter === 'active' 
                  ? "bg-red-500 hover:bg-red-600" 
                  : "bg-[#2BAC67] hover:bg-green-700"
                }
                type="button"
                onClick={controller.handleConfirmAction}
                disabled={
                  !controller.deleteReason.trim() || controller.obsoleteLoading
                }
                loading={controller.obsoleteLoading}
              >
                {controller.procedureFilter === 'active' ? "Confirmar obsolescencia" : "Confirmar reactivación"}
              </SubmitButton>
            </div>
          }
        >
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              {controller.procedureFilter === 'active' 
                ? "Escribe la razón por la que este procedimiento será marcado como obsoleto:"
                : "Escribe la razón por la que este procedimiento será reactivado:"
              }
            </label>
            <textarea
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-transparent"
              rows={3}
              value={controller.deleteReason}
              onChange={(e) => controller.setDeleteReason(e.target.value)}
              placeholder={controller.procedureFilter === 'active' 
                ? "Ej: Procedimiento actualizado por cambios normativos..."
                : "Ej: Se requiere reactivar este procedimiento por cambios operacionales..."
              }
              autoFocus
              disabled={controller.obsoleteLoading}
            />
          
          </div>
        </GlobalModal>
      </TableContainer>
    </>
  );
}