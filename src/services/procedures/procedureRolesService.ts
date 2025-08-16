import api from "../../apiConfig/api";

export const getRolesWithProcedures = async () => {
  const res = await api.get("/procedure/roles");
  return res.data.data;
};

export const getRolesWithPolitics = async () => {
  const res = await api.get("/police/roles");
  return res.data.data;
};

// Update this function to use the correct endpoint
export const getRolesWithManapol = async () => {
  try {
    const res = await api.get("/registerMan/roles/active");
    return res.data.data;
  } catch (error) {
    console.warn('Error fetching roles with manapol:', error);
    return [];
  }
};

export const getAllRoles = async () => {
  const res = await api.get("/rols");
  return res.data.data;
};

export const assignProceduresToRole = async (id_rol: number, id_documento: number[]) => {
  console.log("POST /procedures/assign", { id_rol, id_documento });
  return api.post("/procedures/assign", {
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

export const assignManapolToRole = async (id_rol: number, id_documento: number[]) => {
  console.log("POST /registerMan/assign", { id_rol, id_documento });
  return api.post("/registerMan/assign", {
    id_rol,
    id_documento,
  });
};

export const unassignManapolFromRole = async (id_rol: number, id_documento: number[]) => {
  console.log("DELETE /registerMan/unassign", { id_rol, id_documento });
  return api.delete("/registerMan/unassign", {
    data: {
      id_rol,
      id_documento,
    },
  });
};

// Para obtener todos los manapol disponibles para el modal
export const getAllManapol = async () => {
  const res = await api.get("/registerMan/available");
 
  return res.data.data;
};