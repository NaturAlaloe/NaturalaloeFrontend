//procedures.tsx

import "@fontsource/poppins/700.css";
import FormContainer from "../../components/formComponents/FormContainer";
import InputField from "../../components/formComponents/InputField";
import SelectField from "../../components/formComponents/SelectField";
import PoeSearchInput from "../../components/formComponents/PoeSearchInput";
import VigenciaToggle from "../../components/formComponents/ValidityToggle";
import { useProceduresForm } from "../../hooks/procedureFormHooks/useProceduresForm";
import { usePoeSearch } from "../../hooks/procedureFormHooks/usePoeSearch";
import { useState } from "react";

export default function Procedures() {
  const {
    formData,
    handleSubmit,
    pdfFile,
    poees,
    departamentos,
    responsables,
    categorias,
    handleChange,
    handlePdfChange,
    setPdfFile,
  } = useProceduresForm();

  const {
    busqueda,
    setBusqueda,
    showSugerencias,
    setShowSugerencias,
    resultados,
  } = usePoeSearch(poees);

  // Nuevo estado para el check de vigencia
  const [enVigencia, setEnVigencia] = useState(true);

  return (
    <FormContainer title="Registro de Procedimiento" onSubmit={handleSubmit}>
      {/* Buscador de POE existente */}
      <PoeSearchInput
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        showSugerencias={showSugerencias}
        setShowSugerencias={setShowSugerencias}
        resultados={resultados}
        onSelect={(poe) => setBusqueda(poe.codigo)}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField
          label="Título"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          placeholder="Ingrese título"
          required
        />
        <SelectField
          label="Departamento"
          name="departamento"
          value={formData.departamento}
          onChange={handleChange}
          options={departamentos}
          required
          optionLabel="nombre"
          optionValue="nombre"
        />
        <SelectField
          label="Categoría"
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          options={categorias}
          required
          optionLabel="nombre"
          optionValue="nombre"
        />
        <InputField
          label="Número de POE"
          name="poeNumber"
          value={formData.poeNumber}
          readOnly
          onChange={() => {}}
          required
        />
        <SelectField
          label="Responsable"
          name="responsable"
          value={formData.responsable}
          onChange={handleChange}
          options={responsables.map((r) => ({ nombre: r }))}
          required
          optionLabel="nombre"
          optionValue="nombre"
        />
        <InputField
          label="Revisión"
          name="revision"
          value={formData.revision}
          onChange={handleChange}
          placeholder="1.0"
          pattern="^\d+(\.\d+)?$"
          required
        />
        <InputField
          label="Fecha de Creación"
          name="fechaCreacion"
          value={formData.fechaCreacion}
          onChange={handleChange}
          type="date"
          required
        />
        <InputField
          label="Fecha de Vigencia"
          name="fechaVigencia"
          value={formData.fechaVigencia}
          onChange={handleChange}
          type="date"
          required
        />
        <div className="md:col-start-3 md:row-start-3 flex flex-row items-center justify-center gap-2">
          <VigenciaToggle enVigencia={enVigencia} setEnVigencia={setEnVigencia} />
        </div>
        <div className="md:col-span-3">
          <InputField
            label="Seleccionar PDF"
            name="pdfFile"
            type="file"
            accept="application/pdf"
            onChange={handlePdfChange}
            required={!pdfFile}
          />
          {pdfFile && (
            <div className="flex items-center gap-2 mt-2">
              <p className="text-sm text-[#2AAC67] font-medium">
                Archivo seleccionado: {pdfFile.name}
              </p>
              <button
                type="button"
                className="text-red-600 underline text-xs"
                onClick={() => setPdfFile(null)}
              >
                Quitar
              </button>
            </div>
          )}
        </div>
      </div>
    </FormContainer>
  );
}
