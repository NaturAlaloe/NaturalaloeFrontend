// src/hooks/capacitations/useEvaluatedTraining.ts
import { useEffect, useState } from "react";
import { getEvaluatedTraining, type TrainingItem } from "../../services/capacitations/evaluatedTrainingService";

export interface Colaborador {
  id: number;
  nombre: string;
  nota: string;
  seguimiento: string;
  comentario: string;
}

export const useEvaluatedTraining = (idCapacitacion: number) => {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idCapacitacion) {
      setColaboradores([]);
      setLoading(false);
      return;
    }

    const fetchAndFilter = async () => {
      setLoading(true);
      try {
        const allData: TrainingItem[] = await getEvaluatedTraining();

        const filtered = allData.filter(
          (item) => item.id_capacitacion === idCapacitacion
        );

        const colaboradoresFormateados: Colaborador[] = filtered.map((item) => ({
          id: item.id_colaborador,
          nombre: item.nombre_colaborador,
          nota: item.nota ?? "",
          seguimiento: item.seguimiento ?? "",
          comentario: item.comentario ?? "",
        }));

        setColaboradores(colaboradoresFormateados);
      } catch (err) {
        setError("No se pudieron cargar los colaboradores");
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilter();
  }, [idCapacitacion]);

  return { colaboradores, loading, error, setColaboradores };
};
