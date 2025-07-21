import { useState, useEffect } from "react";
import {
  getCollaboratorDetail,
  type ICollaboratorDetail,
  type ICollaboratorDetailError,
} from "../../services/manage/collaboratorService";

const useCollaboratorDetail = (
  id_colaborador: string | number,
  refreshKey?: number
) => {
  const [data, setData] = useState<ICollaboratorDetail | null>(null);
  const [error, setError] = useState<ICollaboratorDetailError | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setData(null);
    
    getCollaboratorDetail(id_colaborador)
      .then((res) => {
        if (res && 'type' in res) {
          // Es un error
          setError(res);
          setData(null);
        } else {
          // Es data válida
          setData(res);
          setError(null);
        }
      })
      .catch(() => {
        setError({
          type: 'general_error',
          message: "Error al cargar detalles del colaborador"
        });
      })
      .finally(() => setLoading(false));
  }, [id_colaborador, refreshKey]);

  return { data, loading, error };
};

export default useCollaboratorDetail;
