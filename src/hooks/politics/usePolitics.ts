import { useState, useEffect, type ChangeEvent } from "react";
import { createPolitics, getPoliticsConsecutive } from "../../services/politics/politicsService";
import { getResponsibles } from "../../services/responsibles/getResponsibles";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

export function usePolitics() {
  const [formData, setFormData] = useState({
    codigo: "",
    descripcion: "",
    id_responsable: "",
    version: "",
    fecha_creacion: "",
    fecha_vigencia: "",
    
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [responsables, setResponsables] = useState<{ id_responsable: number; nombre_responsable: string }[]>([]);
  const [loadingResponsables, setLoadingResponsables] = useState(false);

  useEffect(() => {
    getPoliticsConsecutive().then((codigo) => {
      setFormData((prev) => ({
        ...prev,
        codigo,
      }));
    });
  }, []);

  useEffect(() => {
    setLoadingResponsables(true);
    getResponsibles()
      .then(setResponsables)
      .finally(() => setLoadingResponsables(false));
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePdfChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.descripcion.trim() ||
      !formData.id_responsable ||
      !formData.version ||
      !formData.fecha_creacion ||
      !formData.fecha_vigencia ||
      !pdfFile
    ) {
      showCustomToast("Atención", "Llena todos los campos obligatorios", "info");
      return;
    }

    const data = new FormData();
    data.append("descripcion", formData.descripcion.trim());
    data.append("id_responsable", String(Number(formData.id_responsable)).trim());
    data.append("version", String(Number(formData.version)).trim());
    data.append("fecha_creacion", formData.fecha_creacion.trim());
    data.append("fecha_vigencia", formData.fecha_vigencia.trim());
    data.append("documento", pdfFile); 

    try {
      await createPolitics(data);
      showCustomToast("Éxito", "Política registrada exitosamente", "success");
      const nuevoCodigo = await getPoliticsConsecutive();
      setFormData({
        codigo: nuevoCodigo,
        descripcion: "",
        id_responsable: "",
        version: "",
        fecha_creacion: "",
        fecha_vigencia: "",

        
      });
      setPdfFile(null);
    } catch (error: any) {
      showCustomToast(
        "Error",
        error?.response?.data?.message || "Ocurrió un error al registrar la política",
        "error"
      );
      throw error;
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    pdfFile,
    setPdfFile,
    handlePdfChange,
    responsables,
    loadingResponsables,
  };
}