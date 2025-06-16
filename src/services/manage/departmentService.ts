import api from '../../apiConfig/api';

export const getDepartments = async () => {
  const res = await api.get('/department');
  return res.data.data;
};

export const addDepartment = async (department: {
  titulo: string;
  id_area: number;
  codigo: number;
}) => {
  const res = await api.post('/department', department);
  return res.data;
};

export const updateDepartment = async (id: number, department: {
  titulo: string;
  id_area: number;
  codigo: number;
}) => {
  const res = await api.put(`/department/${id}`, department);
  return res.data;
};

export const deleteDepartment = async (id: number) => {
  const res = await api.delete(`/department/${id}`);
  return res.data;
};