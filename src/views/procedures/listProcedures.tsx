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
    onDelete: controller.handleDelete,
    selectedRevision: controller.selectedRevision,
    onVersionChange: controller.handleVersionChange,
    getSelectedVersionData: controller.getSelectedVersionData,
  });

  if (controller.loading) return <FullScreenSpinner />;
  if (controller.error) {
    showCustomToast("Error al cargar procedimientos", controller.error, "error");
    return null;
  }

  return (
    <>
      <CustomToaster />
      <TableContainer title="Procedimientos de la Empresa">
        <div className="mb-4">
          <SearchBar
            value={controller.searchTerm}
            onChange={controller.setSearchTerm}
            placeholder="Buscar procedimientos por título o código..."
            className="w-full"
          />
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
          noDataComponent={
            <div className="p-4 text-center text-gray-500">
              No se encontraron procedimientos
            </div>
          }
        />

        {/* Modal de Edición */}
        <GlobalModal
          open={controller.editModal.isOpen}
          onClose={controller.editModal.onClose}
          title="Editar Procedimiento"
          maxWidth="lg"
        >
          {controller.editModal.data && (
            <FormContainer
              title="Editar Procedimiento"
              onSubmit={controller.editModal.onSubmit}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Checkbox para nueva versión */}
                <StyledCheckbox
                  label="¿Es una nueva versión?"
                  checked={controller.editModal.data.es_nueva_version || false}
                  onChange={(checked) =>
                    controller.editModal.handlers.handleCheckboxChange('es_nueva_version', checked)
                  }
                />

                <StyledCheckbox
                  label="¿Es Vigente?"
                  checked={controller.editModal.data.es_vigente || false}
                  onChange={(checked) =>
                    controller.editModal.handlers.handleCheckboxChange('es_vigente', checked)
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
                  value={controller.editModal.data.departamento || "No especificado"}
                  readOnly
                  disabled
                />

                <InputField
                  label="Categoría"
                  name="categoria"
                  value={controller.editModal.data.categoria || "No especificada"}
                  readOnly
                  disabled
                />

                {/* CAMPOS EDITABLES */}
                <InputField
                  label="Título"
                  name="descripcion"
                  value={controller.editModal.data.descripcion}
                  onChange={(e) =>
                    controller.editModal.handlers.handleInputChange('descripcion', e.target.value)
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
                    controller.editModal.handlers.handleInputChange('id_responsable', e.target.value)
                  }
                  options={controller.editModal.responsibles}
                  optionLabel="nombre_responsable"
                  optionValue="id_responsable"
                  disabled={controller.editModal.saving || controller.editModal.loadingResponsibles}
                  required
                />

                <InputField
                  label="Revisión"
                  name="revision"
                  type="number"
                  min="1"
                  step="1"
                  value={controller.editModal.data.revision || ""}
                  onChange={(e) =>
                    controller.editModal.handlers.handleInputChange('revision', e.target.value)
                  }
                  placeholder="1"
                  required
                  disabled={controller.editModal.saving}
                />

                <InputField
                  label="Fecha de Vigencia"
                  name="fecha_vigencia"
                  type="date"
                  value={controller.editModal.data.fecha_vigencia}
                  onChange={(e) =>
                    controller.editModal.handlers.handleInputChange('fecha_vigencia', e.target.value)
                  }
                  required
                  disabled={controller.editModal.saving}
                />

                <div className="md:col-span-2">
                  <PdfInput
                    label="Documento PDF (Opcional - Solo para actualizar)"
                    pdfFile={controller.editModal.data.pdf || null}
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      controller.editModal.handlers.handleFileChange(file);
                    }}
                    onRemove={() => 
                      controller.editModal.handlers.handleFileChange(null)
                    }
                  />
                </div>
              </div>

              <div className="text-center mt-8">
                <SubmitButton width="w-40" disabled={controller.editModal.saving}>
                  {controller.editModal.saving ? "Guardando..." : "Guardar Cambios"}
                </SubmitButton>
              </div>
            </FormContainer>
          )}
        </GlobalModal>

        {/* Modal de Eliminación */}
        <GlobalModal
          open={controller.deleteModal.isOpen}
          onClose={controller.deleteModal.onClose}
          title="Confirmar eliminación"
        >
          <div className="p-4 text-center">
            <p className="text-sm text-gray-700 mb-4">
              ¿Está seguro que desea eliminar este procedimiento?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={controller.deleteModal.onClose}
                className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={controller.deleteModal.onConfirm}
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