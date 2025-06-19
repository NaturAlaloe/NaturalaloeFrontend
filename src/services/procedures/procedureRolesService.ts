import api from "../../apiConfig/api";

export const getRolesWithProcedures = async () => {
  const res = await api.get("/procedure/roles");
  return res.data.data;
};

export const assignProceduresToRole = async (roleId: number, procedureIds: number[]) => {
  // Cambia la URL aquí:
  return api.post("/asignarProcedimientos", {
    roleId,
    procedureIds,
  });
};