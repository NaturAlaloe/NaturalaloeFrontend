import React, { useState } from "react";
import "@fontsource/poppins/700.css";
import FormContainer from "../../components/formComponents/FormContainer";
import InputField from "../../components/formComponents/InputField";
import SubmitButton from "../../components/formComponents/SubmitButton";
import SelectAutocomplete from "../../components/formComponents/SelectAutocomplete";
import CustomToaster from "../../components/globalComponents/CustomToaster";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";
import api from "../../apiConfig/api";

// Definir los tipos de estado permitidos
const ALLOWED_STATUSES = ["actualizar", "obsoletar"] as const;
type StatusType = typeof ALLOWED_STATUSES[number];

interface Document {
  codigo: string;
  tipo: string;
  razon: string;
}

export default function KpiBatchYear() {
  const [formData, setFormData] = useState({
    idArea: "",
    idResponsable: "",
    estado: "actualizar" as StatusType,
  });
  
  const [docs, setDocs] = useState<Document[]>([
    { codigo: "", tipo: "POE", razon: "" }
  ]);
  
  const [loading, setLoading] = useState(false);

  // Opciones para los selects
  const estadoOptions = [
    { id: "actualizar", nombre: "Actualizar" },
    { id: "obsoletar", nombre: "Obsoletar" }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDocChange = (idx: number, field: keyof Document, value: string) => {
    setDocs(prev => 
      prev.map((doc, i) => 
        i === idx ? { ...doc, [field]: value } : doc
      )
    );
  };

  const addDoc = () => setDocs([...docs, { codigo: "", tipo: "POE", razon: "" }]);
  
  const removeDoc = (idx: number) => {
    if (docs.length > 1) {
      setDocs(docs.filter((_, i) => i !== idx));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.idArea || !formData.idResponsable || isNaN(Number(formData.idArea)) || isNaN(Number(formData.idResponsable))) {
      showCustomToast("Error", "Los IDs de área y responsable deben ser números válidos.", "error");
      return false;
    }

    const invalidDocs = docs.some(d => !d.codigo || !d.razon);
    if (invalidDocs) {
      showCustomToast("Error", "Todos los documentos deben tener código y razón.", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        id_area: Number(formData.idArea),
        id_responsable: Number(formData.idResponsable),
        estado: formData.estado,
        cantidad_planificada: docs.length,
        docs_json: JSON.stringify(docs),
        usuario: "system_user",
      };

      const res = await api.post("/procedures/kpi/year", payload);
      
      if (res.data.success) {
        showCustomToast("Éxito", "Lote de KPIs creado correctamente", "success");
        // Resetear formulario
        setFormData({
          idArea: "",
          idResponsable: "",
          estado: "actualizar",
        });
        setDocs([{ codigo: "", tipo: "POE", razon: "" }]);
      } else {
        throw new Error(res.data.message || "Error al crear lote de KPIs");
      }
    } catch (err: any) {
      let errorMsg = "Error al crear lote de KPIs para reglas anuales";
      
      // Detectar error de clave foránea para responsable
      if (err.response?.data?.message?.includes("fk_kpi_responsable") || 
          err.response?.data?.message?.includes("FOREIGN KEY") && 
          err.response?.data?.message?.includes("id_responsable")) {
        errorMsg = "ID de responsable que no existe";
      }
      // Detectar error de clave foránea para área
      else if (err.response?.data?.message?.includes("fk_kpi_area") || 
               err.response?.data?.message?.includes("FOREIGN KEY") && 
               err.response?.data?.message?.includes("id_area")) {
        errorMsg = "ID de área que no existe";
      }
      // Otros errores específicos
      else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      
      showCustomToast("Error", errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CustomToaster />
      <FormContainer title="Crear lote de KPIs anuales (POE)" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            label="ID Área"
            name="idArea"
            value={formData.idArea}
            onChange={handleChange}
            placeholder="Ingrese ID del área"
            type="number"
            required
          />
          
          <InputField
            label="ID Responsable"
            name="idResponsable"
            value={formData.idResponsable}
            onChange={handleChange}
            placeholder="Ingrese ID del responsable"
            type="number"
            required
          />
          
          <SelectAutocomplete
            label="Estado"
            options={estadoOptions}
            optionLabel="nombre"
            optionValue="id"
            value={estadoOptions.find(option => option.id === formData.estado) || null}
            onChange={(value: { id: string; nombre: string } | { id: string; nombre: string }[] | null) => {
              const selected =
                Array.isArray(value) ? value[0] : value;
              if (selected) {
                setFormData(prev => ({
                  ...prev,
                  estado: selected.id as StatusType
                }));
              }
            }}
            placeholder="Seleccionar estado..."
            disabled={false}
          />
        </div>

        {/* Sección de documentos */}
        <div className="col-span-1 md:col-span-3 mt-6">
          <h3 className="text-lg font-semibold text-[#2AAC67] mb-4">
            Documentos POE (Cantidad: {docs.length})
          </h3>
          
          {docs.map((doc, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
              <InputField
                label="Código"
                name={`codigo_${idx}`}
                value={doc.codigo}
                onChange={(e) => handleDocChange(idx, "codigo", e.target.value)}
                placeholder="Ej: 100-24-001"
                required
              />
              
              <InputField
                label="Tipo"
                name={`tipo_${idx}`}
                value={doc.tipo}
                onChange={(e) => handleDocChange(idx, "tipo", e.target.value)}
                placeholder="POE"
                required
                readOnly
              />
              
              <InputField
                label="Razón"
                name={`razon_${idx}`}
                value={doc.razon}
                onChange={(e) => handleDocChange(idx, "razon", e.target.value)}
                placeholder="Actualización de procedimiento"
                required
              />
              
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeDoc(idx)}
                  disabled={docs.length === 1}
                  className={`w-full px-4 py-3 rounded-md text-white font-medium transition-colors ${
                    docs.length === 1 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={addDoc}
              className="px-6 py-3 bg-[#2AAC67] text-white rounded-md hover:bg-[#238B5B] font-medium transition-colors"
            >
              + Agregar Documento
            </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <SubmitButton 
            width="" 
            disabled={loading}
          >
            {loading ? "Guardando..." : "Crear lote de KPIs"}
          </SubmitButton>
        </div>
      </FormContainer>
    </>
  );
}