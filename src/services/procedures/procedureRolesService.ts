import api from "../../apiConfig/api";

export const getRolesWithProcedures = async () => {
  const res = await api.get("/procedure/roles");
  return res.data.data;
};

export const assignProceduresToRole = async (id_rol: number, id_documento: number[]) => {
  return api.put("/procedures/assign", {
    id_rol,
    id_documento,
  });
};