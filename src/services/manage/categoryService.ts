import api from "../../apiConfig/api";

export interface Category {
  id_categoria?: number | null;
  numero_categoria: string;
  nombre_categoria: string;
  estado?: boolean;
}

export const getCategories = async (): Promise<Category[]> => {
  const res = await api.get("/categories");
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data.data)) return res.data.data;
  if (Array.isArray(res.data.categories)) return res.data.categories;
  return [];
};

export const createCategory = async (category: Category): Promise<Category> => {
  const payload: Partial<Category> = { 
    nombre_categoria: category.nombre_categoria,
    numero_categoria: category.numero_categoria,
    estado: category.estado,
  };
  const res = await api.post("/categories", payload);
  return res.data;
};

export const updateCategory = async (category: Category): Promise<Category> => {
  const payload = {
    id_categoria: category.id_categoria,
    nombre_categoria: category.nombre_categoria,
    numero_categoria: category.numero_categoria,
    estado: category.estado,
  };
  const res = await api.put("/categories", payload);
  return res.data;
};

export const deleteCategory = async (id: number) => {
  await api.delete(`/categories/${id}`);
};