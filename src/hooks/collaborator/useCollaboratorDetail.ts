import { useState, useEffect } from "react";
import {
  getCollaboratorDetail,
  type ICollaboratorDetail,
} from "../../services/manage/collaboratorService";

const useCollaboratorDetail = (
  id_colaborador: string | number,
  refreshKey?: number
) => {
  const [data, setData] = useState<ICollaboratorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getCollaboratorDetail(id_colaborador)
      .then((res) => setData(res))
      .catch(() => setError("Error al cargar detalles del colaborador"))
      .finally(() => setLoading(false));
  }, [id_colaborador, refreshKey]);

  return { data, loading, error };
};

export default useCollaboratorDetail;
