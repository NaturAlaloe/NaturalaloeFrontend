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

export const updateDepartment = async (
  _id: number, 
  data: { titulo: string; codigo: number; id_departamento: number; id_area: number }
) => {
  const res = await api.put(`/department`, data);
  return res.data;
};

export const deleteDepartment = async (id: number) => {
  const res = await api.put('/department/delete', { id_departamento: id });
  return res.data;
};