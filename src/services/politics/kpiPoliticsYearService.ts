import api from "../../apiConfig/api";

export interface KpiPoliticsYearData {
  id_responsable: number;
  estado: "actualizar" | "obsoletar";
  cantidad_planificada: number;
  docs_json: string;
  usuario?: string;
}

export async function createKpiPoliticsYear(data: KpiPoliticsYearData) {
  const response = await api.post("/police/kpi/year", data);
  return response.data;
}

export async function getPoliticsForKpi() {
  const response = await api.get("/police");
  return response.data.data;
}
