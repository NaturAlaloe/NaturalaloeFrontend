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
import { motion } from "framer-motion";

// Hooks
import { useVersionedProceduresController } from "../../hooks/listProcedure/useVersionedProceduresController";
import { useVersionedTableColumns } from "../../hooks/listProcedure/useVersionedTableColumns";

export default function ListProcedures() {
  const controller = useVersionedProceduresController();

  // Columnas con manejo de versiones
  const columns = useVersionedTableColumns({
    onEdit: controller.handleEdit,
    onDelete: controller.handleDelete,
    onViewPdf: controller.handleViewPdf,
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
          currentPage={controller.currentPage}
          onChangePage={controller.setCurrentPage}
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
          title=""
          maxWidth="md"
        >
          <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl">
            {/* Decoración de fondo */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-orange-100 rounded-full opacity-60"></div>
            <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-32 h-32 bg-yellow-100 rounded-full opacity-40"></div>
            
            <div className="relative p-8 text-center">
              {/* Icono animado */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 10,
                  delay: 0.1 
                }}
                className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 mb-6 shadow-lg"
              >
                <motion.svg 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                  className="h-10 w-10 text-white" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </motion.svg>
              </motion.div>

              {/* Título principal */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-gray-900 mb-2"
              >
                ¿Marcar como No Vigente?
              </motion.h2>

              {/* Subtítulo */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 mb-6"
              >
                Esta acción marcará el procedimiento como no vigente, manteniendo el historial
              </motion.p>

              {/* Card de información del procedimiento */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-5 mb-6 border border-orange-100 shadow-sm"
              >
                <div className="flex items-center justify-center mb-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Procedimiento a desactivar
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Código:</span>
                    <span className="font-medium text-gray-900">
                      {/* Aquí necesitarías acceso a los datos del procedimiento */}
                      Código del procedimiento
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Título:</span>
                    <span className="font-medium text-gray-900 truncate ml-2">
                      {/* Aquí necesitarías acceso a los datos del procedimiento */}
                      Título del procedimiento
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Departamento:</span>
                    <span className="font-medium text-gray-900">
                      {/* Aquí necesitarías acceso a los datos del procedimiento */}
                      Departamento
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Advertencia */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg"
              >
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-yellow-700">
                    <strong>Información:</strong> El procedimiento se marcará como no vigente pero se conservará el historial
                  </p>
                </div>
              </motion.div>

              {/* Botones de acción */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={controller.deleteModal.onClose}
                  className="px-8 py-3 text-sm font-medium rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-100"
                >
                  ✕ Cancelar
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(251, 146, 60, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={controller.deleteModal.onConfirm}
                  className="px-8 py-3 text-sm font-medium rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-100 shadow-lg"
                >
                  � Marcar como No Vigente
                </motion.button>
              </motion.div>
            </div>
          </div>
        </GlobalModal>
      </TableContainer>
    </>
  );
}