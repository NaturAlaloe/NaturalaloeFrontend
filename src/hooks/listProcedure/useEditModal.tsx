import GlobalModal from "../../components/globalComponents/GlobalModal";
import FormContainer from "../../components/formComponents/FormContainer";
import InputField from "../../components/formComponents/InputField";
import SelectField from "../../components/formComponents/SelectField";
import StyledCheckbox from "../../components/formComponents/StyledCheckbox";
import SubmitButton from "../../components/formComponents/SubmitButton";
import PdfInput from "../../components/formComponents/PdfInput";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  data: any;
  saving: boolean;
  handlers: {
    handleCheckboxChange: (field: 'es_vigente' | 'es_nueva_version', checked: boolean) => void;
    handleInputChange: (field: any, value: string) => void;
    handleFileChange: (file: File | null) => void;
  };
  responsibles: any[];
  loadingResponsibles: boolean;
}

export function useEditModal() {
  const EditModal = ({
    isOpen,
    onClose,
    onSubmit,
    data,
    saving,
    handlers,
    responsibles,
    loadingResponsibles,
  }: EditModalProps) => (
    <GlobalModal
      open={isOpen}
      onClose={onClose}
      title="Editar Procedimiento"
      maxWidth="lg"
    >
      {data && (
        <FormContainer
          title="Editar Procedimiento"
          onSubmit={onSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Checkbox para nueva versión */}
            <StyledCheckbox
              label="¿Es una nueva versión?"
              checked={data.es_nueva_version || false}
              onChange={(checked) =>
                handlers.handleCheckboxChange('es_nueva_version', checked)
              }
            />

            <StyledCheckbox
              label="¿Es Vigente?"
              checked={data.es_vigente || false}
              onChange={(checked) =>
                handlers.handleCheckboxChange('es_vigente', checked)
              }
            />
            
            {/* CAMPOS DE SOLO LECTURA */}
            <InputField
              label="Código POE"
              name="codigo_poe"
              value={data.codigo || "No aplica"}
              readOnly
              disabled
            />

            <InputField
              label="Fecha de Creación"
              name="fecha_creacion"
              type="date"
              value={data.fecha_creacion}
              readOnly
              disabled
            />

            <InputField
              label="Departamento"
              name="departamento"
              value={data.departamento || "No especificado"}
              readOnly
              disabled
            />

            <InputField
              label="Categoría"
              name="categoria"
              value={data.categoria || "No especificada"}
              readOnly
              disabled
            />

            {/* CAMPOS EDITABLES */}
            <InputField
              label="Título"
              name="descripcion"
              value={data.descripcion}
              onChange={(e) =>
                handlers.handleInputChange('descripcion', e.target.value)
              }
              placeholder="Ingrese título"
              required
              disabled={saving}
            />

            <SelectField
              label="Responsable"
              name="responsable"
              value={data.id_responsable || ""}
              onChange={(e) =>
                handlers.handleInputChange('id_responsable', e.target.value)
              }
              options={responsibles}
              optionLabel="nombre_responsable"
              optionValue="id_responsable"
              disabled={saving || loadingResponsibles}
              required
            />

            <InputField
              label="Revisión"
              name="revision"
              type="number"
              min="1"
              step="1"
              value={data.revision || ""}
              onChange={(e) =>
                handlers.handleInputChange('revision', e.target.value)
              }
              placeholder="1"
              required
              disabled={saving}
            />

            <InputField
              label="Fecha de Vigencia"
              name="fecha_vigencia"
              type="date"
              value={data.fecha_vigencia}
              onChange={(e) =>
                handlers.handleInputChange('fecha_vigencia', e.target.value)
              }
              required
              disabled={saving}
            />

            <div className="md:col-span-2">
              <PdfInput
                label="Documento PDF (Opcional - Solo para actualizar)"
                pdfFile={data.pdf || null}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  handlers.handleFileChange(file);
                }}
                onRemove={() => 
                  handlers.handleFileChange(null)
                }
              />
            </div>
          </div>

          <div className="text-center mt-8">
            <SubmitButton width="w-40" disabled={saving}>
              {saving ? "Guardando..." : "Guardar Cambios"}
            </SubmitButton>
          </div>
        </FormContainer>
      )}
    </GlobalModal>
  );

  return { EditModal };
}
