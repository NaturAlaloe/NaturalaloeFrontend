import api from "../../apiConfig/api";

export const getRolesWithProcedures = async () => {
  const res = await api.get("/procedure/roles");
  return res.data.data;
};

  export const assignProceduresToRole = async (id_rol: number, id_documento: number[]) => {
    console.log("POST /procedures/assignProcedures", { id_rol, id_documento });
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