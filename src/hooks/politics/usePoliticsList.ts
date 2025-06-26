import { useEffect, useState, useMemo } from "react";
import { getPoliticsList, updatePolitics, deletePolitics } from "../../services/politics/politicsService";
import { getResponsibles } from "../../services/responsibles/getResponsibles";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

interface Politics {
  id_politica: number;
  codigo: string;
  descripcion: string;
  version: string;
  version_actual: number;
  fecha_creacion: string;
  fecha_vigencia: string;
  id_responsable: number;
  responsable: string;
}

export default function usePoliticsList() {
  const [politics, setPolitics] = useState<Politics[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editPoliticsObj, setEditPoliticsObj] = useState<Politics | null>(null);
  const [deletePoliticsObj, setDeletePoliticsObj] = useState<Politics | null>(null);

  // Form states
  const [descripcionInput, setDescripcionInput] = useState("");
  const [responsableInput, setResponsableInput] = useState("");
  const [versionInput, setVersionInput] = useState("");
  const [fechaVigenciaInput, setFechaVigenciaInput] = useState("");
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
      .then((data) => setPolitics(data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoadingResponsables(true);
    getResponsibles()
      .then(setResponsables)
      .finally(() => setLoadingResponsables(false));
  }, []);

  const filteredPolitics = useMemo(() => {
    if (!search) return politics;
    const lowerSearch = search.toLowerCase();
    return politics.filter((p) =>
      Object.values(p)
        .map((v) => (typeof v === "string" ? v.toLowerCase() : String(v)))
        .some((field) => field.includes(lowerSearch))
    );
  }, [politics, search]);

  // Cambia setSearch para que también reinicie la página
  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // Modal handlers
  const handleOpenAdd = () => {
    setEditPoliticsObj(null);
    setDescripcionInput("");
    setResponsableInput("");
    setVersionInput("");
    setFechaVigenciaInput("");
    setModalOpen(true);
  };

  const handleOpenEdit = (row: Politics) => {
    setEditPoliticsObj(row);
    setDescripcionInput(row.descripcion);
    setResponsableInput(String(row.id_responsable));
    setVersionInput(row.version);
    setFechaVigenciaInput(row.fecha_vigencia.slice(0, 10));
    setModalOpen(true);
  };

  const handleOpenDelete = (row: Politics) => {
    setDeletePoliticsObj(row);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPoliticsObj) return;
    try {
      setLoading(true);

      // Construye el FormData con los campos requeridos
      const formData = new FormData();
      formData.append("id_politica", String(editPoliticsObj.id_politica)); // <-- El id va en el body
      formData.append("descripcion", descripcionInput);
      formData.append("id_responsable", responsableInput);
      formData.append("version", versionInput);
      formData.append("fecha_vigencia", fechaVigenciaInput);
      if (pdfFile) {
        formData.append("documento", pdfFile);
      }

      await updatePolitics(formData); // <-- Solo el formData

      showCustomToast("Éxito", "Política actualizada", "success");
      const data = await getPoliticsList();
      setPolitics(data);
      setModalOpen(false);
      setEditPoliticsObj(null);
      setPdfFile(null);
    } catch (error: any) {
      showCustomToast("Error", "No se pudo actualizar", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletePoliticsObj) return;
    try {
      setLoading(true);
      await deletePolitics(deletePoliticsObj.id_politica);
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
    search,
    setSearch: handleSearch,
    currentPage,
    setCurrentPage,
    modalOpen,
    setModalOpen,
    editPoliticsObj,
    setEditPoliticsObj,
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
    responsables,
    loadingResponsables,
    handleOpenAdd,
    handleOpenEdit,
    handleOpenDelete,
    handleSave,
    handleDelete,
    pdfFile,
    setPdfFile,
    handlePdfChange,
  };
}