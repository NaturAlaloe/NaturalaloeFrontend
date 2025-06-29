import { useEffect, useState, useMemo } from "react";
import { getPoliticsList, updatePolitics, deletePolitics } from "../../services/politics/politicsService";
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

  // Estado para versiones seleccionadas
  const [selectedVersions, setSelectedVersions] = useState<Record<string, number>>({});

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editPoliticsObj, setEditPoliticsObj] = useState<PoliticsVersion | null>(null);
  const [deletePoliticsObj, setDeletePoliticsObj] = useState<PoliticsVersion | null>(null);

  // Form states
  const [descripcionInput, setDescripcionInput] = useState("");
  const [responsableInput, setResponsableInput] = useState("");
  const [versionInput, setVersionInput] = useState("");
  const [fechaVigenciaInput, setFechaVigenciaInput] = useState("");
  const [fechaCreacionInput, setFechaCreacionInput] = useState("");
  const [esNuevaVersion, setEsNuevaVersion] = useState(false);
  const [esVigente, setEsVigente] = useState(false);

  const [responsables, setResponsables] = useState<{ id_responsable: number; nombre_responsable: string }[]>([]);
  const [loadingResponsables, setLoadingResponsables] = useState(false);

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
        // Inicializar versiones seleccionadas con la versión vigente
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

  // Función para manejar el cambio de versión
  const handleVersionChange = (codigoPolitica: string, versionId: string) => {
    setSelectedVersions(prev => ({
      ...prev,
      [codigoPolitica]: parseInt(versionId)
    }));
  };

  // Crear datos expandidos para la tabla
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
        // Mapear campos para compatibilidad con la tabla actual
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
    
    // Buscar el responsable correcto por nombre
    const responsableEncontrado = responsables.find(
      (r) => r.nombre_responsable === row.responsable
    );
    setResponsableInput(responsableEncontrado ? String(responsableEncontrado.id_responsable) : "");
    
    setVersionInput(row.revision?.toString() || row.version);
    setFechaVigenciaInput(row.fecha_vigencia.slice(0, 10));
    setFechaCreacionInput(row.fecha_creacion?.slice(0, 10) || "");
    setEsVigente(row.vigente === 1);
    setModalOpen(true);
  };

  const handleOpenDelete = (row: any) => {
    setDeletePoliticsObj(row);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPoliticsObj) return;
    
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("id_documento", String(editPoliticsObj.id_documento));
      formData.append("titulo", descripcionInput);
      formData.append("id_responsable", responsableInput);
      formData.append("revision", versionInput);
      formData.append("fecha_vigencia", fechaVigenciaInput);
      formData.append("vigente", esVigente ? "1" : "0");
      formData.append("es_nueva_version", esNuevaVersion ? "1" : "0");
      
      if (pdfFile) {
        formData.append("documento", pdfFile);
      }

      await updatePolitics(formData);
      showCustomToast("Éxito", "Política actualizada", "success");
      
      const data = await getPoliticsList();
      setPolitics(data);
      setModalOpen(false);
      setEditPoliticsObj(null);
      setPdfFile(null);
    } catch (error: any) {
      showCustomToast("Error", "No se pudo actualizar", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletePoliticsObj) return;
    try {
      setLoading(true);
      await deletePolitics(deletePoliticsObj.id_documento);
      showCustomToast("Éxito", "Política eliminada", "success");
      const data = await getPoliticsList();
      setPolitics(data);
    } catch (error: any) {
      showCustomToast("Error", "No se pudo eliminar", "error");
    } finally {
      setDeletePoliticsObj(null);
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
  };
}