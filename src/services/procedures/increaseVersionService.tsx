import api from "../../apiConfig/api";

export async function increaseVersion(data: {
  codigo: string;
  descripcion: string;
  id_responsable: number;
  nueva_version: number;
  fecha_creacion: string;
  fecha_vigencia: string;
  vigente: number;
  version_actual: number;
  documento?: File;
}) {
  const formData = new FormData();

  // Agregar todos los campos requeridos al FormData
  formData.append("codigo", data.codigo);
  formData.append("descripcion", data.descripcion);
  formData.append("id_responsable", data.id_responsable.toString());
  formData.append("nueva_version", data.nueva_version.toString());
  formData.append("fecha_creacion", data.fecha_creacion);
  formData.append("fecha_vigencia", data.fecha_vigencia);
  formData.append("vigente", data.vigente.toString());
  formData.append("version_actual", data.version_actual.toString());
  
  // Agregar documento PDF si se proporciona
  if (data.documento) {
    formData.append("documento", data.documento);
  }

  const response = await api.put("/procedures/increase", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  return response.data;
}
