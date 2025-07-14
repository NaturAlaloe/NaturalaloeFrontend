import { useEffect, useState, useMemo } from "react";
import {
  getPoliticsList,
  updatePolitics,
  createNewPoliticsVersion,
  obsoletePolitics,
} from "../../services/politics/politicsService";
import { getResponsibles } from "../../services/responsibles/getResponsibles";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

interface PoliticsVersion {
  titulo: string;
  vigente: number;
  revision: number;
  responsable: string;
  id_documento: number;
  fecha_vigencia: string;
  ruta_documento: string;
  version_actual: number;
}

interface ExpandedPoliticsVersion extends PoliticsVersion {
  codigo_politica: string;
  fecha_creacion: string;
  versiones: PoliticsVersion[];
  codigo: string;
  descripcion: string;
  version: string;
}

interface Politics {
  codigo_politica: string;
  fecha_creacion: string;
  versiones: PoliticsVersion[];
}

export default function usePoliticsList() {
  const [politics, setPolitics] = useState<Politics[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [selectedVersions, setSelectedVersions] = useState<Record<string, number>>({});

  const [modalOpen, setModalOpen] = useState(false);
  const [editPoliticsObj, setEditPoliticsObj] = useState<ExpandedPoliticsVersion | null>(null);
  const [deletePoliticsObj, setDeletePoliticsObj] = useState<ExpandedPoliticsVersion | null>(null);

  const [descripcionInput, setDescripcionInput] = useState("");
  const [responsableInput, setResponsableInput] = useState("");
  const [versionInput, setVersionInput] = useState("");
  const [fechaVigenciaInput, setFechaVigenciaInput] = useState("");
  const [fechaCreacionInput, setFechaCreacionInput] = useState("");
  const [esNuevaVersion, setEsNuevaVersion] = useState(false);
  const [esVigente, setEsVigente] = useState(false);

  const [responsables, setResponsables] = useState<{ id_responsable: number; nombre_responsable: string }[]>([]);
  const [loadingResponsables, setLoadingResponsables] = useState(false);


  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    setLoading(true);
    getPoliticsList()
      .then((data) => {
        setPolitics(data);
        const initialSelections: Record<string, number> = {};
        data.forEach((politica: Politics) => {
          const versionVigente = politica.versiones.find(v => v.vigente === 1);
          if (versionVigente) {
            initialSelections[politica.codigo_politica] = versionVigente.id_documento;
          }
        });
        setSelectedVersions(initialSelections);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoadingResponsables(true);
    getResponsibles()
      .then(setResponsables)
      .finally(() => setLoadingResponsables(false));
  }, []);


  const handleVersionChange = (codigoPolitica: string, versionId: string) => {
    setSelectedVersions(prev => ({
      ...prev,
      [codigoPolitica]: parseInt(versionId)
    }));
  };

  
  const handleAskReason = () => {
    setDeleteReason("");
    setReasonModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    await handleDelete(deleteReason);
    setReasonModalOpen(false);
  };

  const expandedPolitics = useMemo(() => {
    return politics.flatMap(politica => {
      const selectedVersionId = selectedVersions[politica.codigo_politica];
      if (!selectedVersionId) return [];

      const selectedVersion = politica.versiones.find(v => v.id_documento === selectedVersionId);
      if (!selectedVersion) return [];

      return [{
        ...selectedVersion,
        codigo_politica: politica.codigo_politica,
        fecha_creacion: politica.fecha_creacion,
        versiones: politica.versiones,
        codigo: politica.codigo_politica,
        descripcion: selectedVersion.titulo,
        responsable: selectedVersion.responsable,
        version: selectedVersion.revision.toString(),
        fecha_vigencia: selectedVersion.fecha_vigencia,
        ruta_documento: selectedVersion.ruta_documento,
      }];
    });
  }, [politics, selectedVersions]);

  const filteredPolitics = useMemo(() => {
    if (!search) return expandedPolitics;
    const lowerSearch = search.toLowerCase();
    return expandedPolitics.filter((p) =>
      Object.values(p)
        .map((v) => (typeof v === "string" ? v.toLowerCase() : String(v)))
        .some((field) => field.includes(lowerSearch))
    );
  }, [expandedPolitics, search]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleOpenEdit = (row: any) => {
    setEditPoliticsObj(row);
    setDescripcionInput(row.titulo || row.descripcion);

    const responsableEncontrado = responsables.find(
      (r) => r.nombre_responsable === row.responsable
    );
    setResponsableInput(responsableEncontrado ? String(responsableEncontrado.id_responsable) : "");

    setVersionInput(row.revision?.toString() || row.version);
    setFechaVigenciaInput(row.fecha_vigencia.slice(0, 10));
    setFechaCreacionInput(row.fecha_creacion?.slice(0, 10) || "");
    setEsVigente(row.vigente === 1);
    setModalOpen(true);
    showCustomToast(
      "Editor de política",
      `Abriendo editor para: ${row.codigo || 'Política'}`,
      "info"
    );
  };

  const handleOpenDelete = (row: any) => {
    setDeletePoliticsObj(row);
  };


  const formatDateToBackend = (dateString: string | Date | undefined): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        if (
          typeof dateString === "string" &&
          /^\d{4}-\d{2}-\d{2}$/.test(dateString)
        ) {
          return dateString;
        }
        throw new Error("Fecha inválida");
      }
      return date.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };




  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPoliticsObj) return;

    try {
      setSaving(true);
      const formData = new FormData();

      if (esNuevaVersion) {
        const codigo = politics.find(p => p.versiones.some(v => v.id_documento === editPoliticsObj?.id_documento))?.codigo_politica || "";

        formData.append("codigo", codigo);
        formData.append("descripcion", descripcionInput);
        formData.append("id_responsable", Number(responsableInput).toString());
        formData.append("nueva_version", parseFloat(versionInput).toString());
        formData.append("fecha_creacion", formatDateToBackend(fechaCreacionInput));
        formData.append("fecha_vigencia", formatDateToBackend(fechaVigenciaInput));
        formData.append("vigente", esVigente ? "1" : "0");
        formData.append("version_actual", esVigente ? "1" : "0");

        if (pdfFile) {
          formData.append("documento", pdfFile);
        }
        console.log("FormData para nueva versión:", Object.fromEntries(formData.entries()));

        await createNewPoliticsVersion(formData);
        showCustomToast("Éxito", "Nueva versión creada exitosamente", "success");

      } else {
        // Required field
        formData.append("id_politica", String(editPoliticsObj.id_documento));

        // Optional fields - only append if values exist
        if (descripcionInput.trim()) {
          formData.append("descripcion", descripcionInput.trim());
        }

        if (responsableInput) {
          formData.append("id_responsable", responsableInput);
        }

        if (versionInput) {
          formData.append("version", versionInput);
        }

        if (fechaVigenciaInput) {
          formData.append("fecha_vigencia", fechaVigenciaInput);
        }

        formData.append("vigente", esVigente ? "1" : "0");
        formData.append("version_actual", esVigente ? "1" : "0");

        if (pdfFile) {
          formData.append("documento", pdfFile);
        }

        console.log("FormData para actualización:", Object.fromEntries(formData.entries()));

        await updatePolitics(formData);
        showCustomToast("Éxito", "Política actualizada exitosamente", "success");
      }

      const data = await getPoliticsList();
      setPolitics(data);
      setModalOpen(false);
      setEditPoliticsObj(null);
      setPdfFile(null);
      setEsNuevaVersion(false);
      setEsVigente(false);
    } catch (error: any) {
      showCustomToast(
        "Error",
        error?.response?.data?.message || "No se pudo guardar los cambios",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };


  const handleDelete = async (razon_cambio: string) => {
    if (!deletePoliticsObj) return;
    try {
      setLoading(true);
      await obsoletePolitics(deletePoliticsObj.id_documento, razon_cambio);
      showCustomToast("Éxito", "Política marcada como obsoleta", "success");
      const data = await getPoliticsList();
      console.log("Lista actualizada:", data); // <-- Depura aquí
      setPolitics(data);
      setDeletePoliticsObj(null);
      setReasonModalOpen(false);
      setDeleteReason("");
    } catch (error: any) {
      showCustomToast("Error", "No se pudo marcar como obsoleta", "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    politics,
    filteredPolitics,
    loading,
    saving,
    search,
    setSearch: handleSearch,
    currentPage,
    setCurrentPage,
    selectedVersions,
    handleVersionChange,
    modalOpen,
    setModalOpen,
    editPoliticsObj,
    deletePoliticsObj,
    setDeletePoliticsObj,
    descripcionInput,
    setDescripcionInput,
    responsableInput,
    setResponsableInput,
    versionInput,
    setVersionInput,
    fechaVigenciaInput,
    setFechaVigenciaInput,
    fechaCreacionInput,
    setFechaCreacionInput,
    esNuevaVersion,
    setEsNuevaVersion,
    esVigente,
    setEsVigente,
    responsables,
    loadingResponsables,
    handleOpenEdit,
    handleOpenDelete,
    handleSave,
    handleDelete,
    pdfFile,
    setPdfFile,
    handlePdfChange,
    handleConfirmDelete,
    handleAskReason,
    reasonModalOpen,
    setReasonModalOpen,
    setDeleteReason,
    deleteReason,
    
  };
}