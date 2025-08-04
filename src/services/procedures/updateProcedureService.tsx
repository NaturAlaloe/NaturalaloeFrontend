import api from "../../apiConfig/api";

export async function updateProcedure(data: {
  id_documento: number;
  codigo?: string;
  descripcion?: string;
  id_area?: number;
  id_departamento?: number;
  id_categoria?: number;
  id_responsable?: number;
  version?: number;
  fecha_creacion?: string;
  fecha_vigencia?: string;
  vigente?: number;
  documento?: File;
}) {
  
  const formData = new FormData();

  // Agregar todos los campos al FormData según la documentación de la API
  formData.append("id_documento", data.id_documento.toString());
  
  if (data.codigo) formData.append("codigo", data.codigo);
  if (data.descripcion) formData.append("descripcion", data.descripcion);
  if (data.id_area) formData.append("id_area", data.id_area.toString());
  if (data.id_departamento) formData.append("id_departamento", data.id_departamento.toString());
  if (data.id_categoria) formData.append("id_categoria", data.id_categoria.toString());
  if (data.id_responsable) formData.append("id_responsable", data.id_responsable.toString());
  if (data.version !== undefined && data.version !== null) formData.append("version", data.version.toString());
  if (data.fecha_creacion) formData.append("fecha_creacion", data.fecha_creacion);
  if (data.fecha_vigencia) formData.append("fecha_vigencia", data.fecha_vigencia);
  if (data.vigente !== undefined) formData.append("vigente", data.vigente.toString());
  if (data.documento) formData.append("documento", data.documento);

  const response = await api.put("/procedureList", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  return response.data;
}
