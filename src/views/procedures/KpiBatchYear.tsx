import "@fontsource/poppins/700.css";
import { useState } from "react";
import FormContainer from "../../components/formComponents/FormContainer";
import SubmitButton from "../../components/formComponents/SubmitButton";
import SelectAutocomplete from "../../components/formComponents/SelectAutocomplete";
import CustomToaster from "../../components/globalComponents/CustomToaster";
import ProceduresTableModal from "../../components/ProceduresTableModal";
import GlobalModal from "../../components/globalComponents/GlobalModal";
import FullScreenSpinner from "../../components/globalComponents/FullScreenSpinner";
import { useKpiBatchYear } from "../../hooks/procedures/useKpiBatchYear";

type StatusType = "actualizar" | "obsoletar";

export default function KpiBatchYear() {
  const {
    formData,
    docs,
    availablePOEs,
    isModalOpen,
    loading,
    loadingData,
    estadoOptions,
    areas,
    responsables,
    handleDocReasonChange,
    handleStateChange,
    handleAreaChange,
    handleResponsableChange,
    addSelectedPOEs,
    removeDoc,
    openModal,
    closeModal,
    handleSubmit,
  } = useKpiBatchYear();

  const [selectedPOEIds, setSelectedPOEIds] = useState<string[]>([]);

  const handleModalSave = () => {
    addSelectedPOEs(selectedPOEIds);
    setSelectedPOEIds([]);
  };

  const handleModalCancel = () => {
    setSelectedPOEIds([]);
    closeModal();
  };

  if (loadingData) {
    return <FullScreenSpinner />;
  }

  return (
    <>
      <CustomToaster />
      <FormContainer title="Crear lote de KPIs anuales (POE)" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SelectAutocomplete
            label="Área"
            options={areas}
            optionLabel="nombre"
            optionValue="id"
            value={areas.find(area => area.id === formData.idArea) || null}
            onChange={(value: { id: number; nombre: string } | { id: number; nombre: string }[] | null) => {
              const selected = Array.isArray(value) ? value[0] : value;
              handleAreaChange(selected);
            }}
            placeholder="Seleccionar área..."
            disabled={false}
          />
          
          <SelectAutocomplete
            label="Responsable"
            options={responsables}
            optionLabel="nombre"
            optionValue="id"
            value={responsables.find(resp => resp.id === formData.idResponsable) || null}
            onChange={(value: { id: number; nombre: string } | { id: number; nombre: string }[] | null) => {
              const selected = Array.isArray(value) ? value[0] : value;
              handleResponsableChange(selected);
            }}
            placeholder="Seleccionar responsable..."
            disabled={false}
          />
          
          <SelectAutocomplete
            label="Estado"
            options={estadoOptions}
            optionLabel="nombre"
            optionValue="id"
            value={estadoOptions.find(option => option.id === formData.estado) || null}
            onChange={(value: { id: string; nombre: string } | { id: string; nombre: string }[] | null) => {
              const selected = Array.isArray(value) ? value[0] : value;
              if (selected) {
                handleStateChange(selected.id as StatusType);
              }
            }}
            placeholder="Seleccionar estado..."
            disabled={false}
          />
        </div>

        {/* Sección de POEs seleccionados */}
        <div className="col-span-1 md:col-span-3 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#2AAC67]">
              POEs Seleccionados (Cantidad: {docs.length})
            </h3>
            <button
              type="button"
              onClick={openModal}
              className="px-6 py-3 bg-[#2AAC67] text-white rounded-md hover:bg-[#238B5B] font-medium transition-colors"
            >
              + Seleccionar POEs
            </button>
          </div>
          
          {docs.length > 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F0FFF4] border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#2AAC67] uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#2AAC67] uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#2AAC67] uppercase tracking-wider">
                      Razón
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-[#2AAC67] uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {docs.map((doc, index) => (
                    <tr 
                      key={doc.id_documento} 
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 ${
                        index === docs.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {doc.codigo}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                        <div className="truncate" title={doc.titulo}>
                          {doc.titulo}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={doc.razon}
                          onChange={(e) => handleDocReasonChange(doc.id_documento, e.target.value)}
                          placeholder="Especificar razón..."
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2AAC67] focus:border-[#2AAC67] transition-all duration-200 placeholder:text-gray-400 hover:border-gray-400"
                          required
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => removeDoc(doc.id_documento)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 hover:border-red-400 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-red-500 shadow-sm hover:shadow-md"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm">
                No hay POEs seleccionados. Haga clic en "Seleccionar POEs" para agregar.
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <SubmitButton 
            width="" 
            disabled={loading || docs.length === 0}
          >
            {loading ? "Guardando..." : "Crear lote de KPIs"}
          </SubmitButton>
        </div>
      </FormContainer>

    
      {loading && <FullScreenSpinner />}

 
      <GlobalModal
        open={isModalOpen}
        onClose={handleModalCancel}
        title="Seleccionar POEs"
        maxWidth="md"
        fullWidth={true}
        actions={
          <div className="flex justify-center space-x-3 w-full">
            <button
              type="button"
              onClick={handleModalCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleModalSave}
              disabled={selectedPOEIds.length === 0}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                selectedPOEIds.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#2AAC67] text-white hover:bg-[#238B5B]'
              }`}
            >
              Guardar Selección ({selectedPOEIds.length})
            </button>
          </div>
        }
      >
        <ProceduresTableModal
          procedimientos={availablePOEs}
          procedimientosSeleccionados={selectedPOEIds}
          onSeleccionChange={setSelectedPOEIds}
          tipo="poe"
        />
      </GlobalModal>
    </>
  );
}