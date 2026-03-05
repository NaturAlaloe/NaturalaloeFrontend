import { useState, useEffect, useRef, useCallback, type ChangeEvent } from "react";
import { createPolitics, getPoliticsConsecutive, getPoliticsList } from "../../services/politics/politicsService";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Código editable manualmente
  const [codigoOverride, setCodigoOverride] = useState("");
  const [isManualEdit, setIsManualEdit] = useState(false);
  // Formato: 2 dígitos - 2 dígitos (ej: 01-01)
  const CODE_REGEX_POL = /^\d{2}-\d{2}$/;
  // Valor mostrado: si el usuario no ha editado, usa el auto-generado
  const codigoDisplay = isManualEdit ? codigoOverride : formData.codigo;

  const handleCodigoChange = useCallback((value: string) => {
    setIsManualEdit(true);
    setCodigoOverride(value);
  }, []);

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

    if (!codigoDisplay.trim()) {
      showCustomToast("Código requerido", "Espera a que se genere el código o ingrésalo manualmente", "error");
      return;
    }

    if (!CODE_REGEX_POL.test(codigoDisplay)) {
      showCustomToast("Código inválido", "El código debe seguir la estructura: 00-00", "error");
      return;
    }

    // Verificar que el código no exista
    try {
      const lista = await getPoliticsList();
      const existe = lista.some((p: any) =>
        p.codigo_politica?.toLowerCase() === codigoDisplay.toLowerCase()
      );
      if (existe) {
        showCustomToast("Código duplicado", "Este código ya existe en las políticas activas.", "error");
        return;
      }
    } catch {
      showCustomToast("Error de verificación", "No se pudo verificar si el código ya existe.", "error");
      return;
    }

    const data = new FormData();
    data.append("codigo", codigoDisplay);
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
      setIsManualEdit(false);
      setCodigoOverride("");
      setFormData({
        codigo: nuevoCodigo,
        descripcion: "",
        id_responsable: "",
        version: "",
        fecha_creacion: "",
        fecha_vigencia: "",
      });
      setPdfFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      showCustomToast(
        "Error",
        error?.response?.data?.message || "Ocurrió un error al registrar la política",
        "error"
      );
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
    fileInputRef,
    codigoDisplay,
    handleCodigoChange,
  };
}