import { useEffect, useState, useMemo } from 'react';
import {
  type Category,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory as deleteCategoryService,
} from '../../services/manage/categoryService';
import { showCustomToast } from '../../components/globalComponents/CustomToaster';

export const useCategoriesList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editCategoryObj, setEditCategoryObj] = useState<Category | null>(null);
  const [deleteCategoryObj, setDeleteCategoryObj] = useState<Category | null>(null);
  const [categoryInput, setCategoryInput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch categories on mount y para refetch
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError('Error al obtener las categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const refetch = fetchCategories;

  // Filtrado con useMemo
  const filteredCategories = useMemo(() => {
    return Array.isArray(categories)
      ? categories.filter((cat) =>
          (cat.nombre_categoria || "").toLowerCase().includes(search.toLowerCase()) ||
          String(cat.numero_categoria || "")
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      : [];
  }, [categories, search]);

  const handleOpenAdd = () => {
    setModalOpen(true);
    setEditCategoryObj(null);
    setCategoryInput('');
    setError(null);
  };

  const handleOpenEdit = (category: Category) => {
    setModalOpen(true);
    setEditCategoryObj(category);
    setCategoryInput(category.nombre_categoria);
    setError(null);
  };

  const handleOpenDelete = (category: Category) => {
    setDeleteCategoryObj(category);
    setError(null);
  };

  const handleSave = async (event: React.FormEvent, codigoInput: string) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (editCategoryObj) {
        await updateCategory({
          ...editCategoryObj,
          nombre_categoria: categoryInput,
          numero_categoria: codigoInput,
        });
        showCustomToast("Éxito", "Categoría actualizada correctamente", "success");
      } else {
        await createCategory({
          nombre_categoria: categoryInput,
          numero_categoria: codigoInput,
          estado: true,
        });
        showCustomToast("Éxito", "Categoría creada correctamente", "success");
      }
      await refetch();
      setModalOpen(false);
      setEditCategoryObj(null);
      setCategoryInput('');
    } catch (err) {
      setError('Error al guardar la categoría');
      showCustomToast("Error", "No se pudo guardar la categoría", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCategoryObj?.id_categoria) return;
    setError(null);
    setLoading(true);
    try {
      await deleteCategoryService(deleteCategoryObj.id_categoria);
      await refetch();
      setDeleteCategoryObj(null);
      showCustomToast("Éxito", "Categoría eliminada correctamente", "success");
    } catch (err: any) {
      if (err?.response?.data?.message) {
        setError(err.response.data.message);
        showCustomToast("Atención", err.response.data.message, "info");
      } else {
        setError('Error al eliminar la categoría');
        showCustomToast("Error", "No se pudo eliminar la categoría", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    search,
    setSearch,
    filteredCategories,
    modalOpen,
    setModalOpen,
    editCategoryObj,
    setEditCategoryObj,
    deleteCategoryObj,
    setDeleteCategoryObj,
    categoryInput,
    setCategoryInput,
    handleOpenAdd,
    handleOpenEdit,
    handleOpenDelete,
    handleSave,
    handleDelete,
    error,
    refetch,
    currentPage,
    setCurrentPage,
  };
};