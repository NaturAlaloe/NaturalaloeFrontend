import api from "../../apiConfig/api";

export const getRolesWithProcedures = async () => {
  const res = await api.get("/procedure/roles");
  return res.data.data;
};

export const getRolesWithPolitics = async () => {
  const res = await api.get("/police/roles");
  return res.data.data;
};

export const getAllRoles = async () => {
  const res = await api.get("/rols");
  return res.data.data;
};

export const assignProceduresToRole = async (id_rol: number, id_documento: number[]) => {
  console.log("POST /assignProcedures", { id_rol, id_documento });
  return api.post("/assignProcedures", {
    id_rol,
    id_documento,
  });
};

export const unassignProceduresFromRole = async (id_rol: number, id_documento: number[]) => {
  console.log("DELETE /procedures/unassign", { id_rol, id_documento });
  return api.delete("/procedures/unassign", {
    data: {
      id_rol,
      id_documento,
    },
  });
};

export const assignPoliticsToRole = async (id_rol: number, id_documento: number[]) => {
  console.log("POST /police/assign", { id_rol, id_documento });
  return api.post("/police/assign", {
    id_rol,
    id_documento,
  });
};

export const unassignPoliticsFromRole = async (id_rol: number, id_documento: number[]) => {
  console.log("DELETE /police/unassign", { id_rol, id_documento });
  return api.delete("/police/unassign", {
    data: {
      id_rol,
      id_documento,
    },
  });
};