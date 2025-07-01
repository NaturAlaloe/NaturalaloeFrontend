// src/hooks/capacitations/useEvaluatedTraining.ts
import { useEffect, useState } from "react";
import {
  getEvaluatedTraining,
  type TrainingItem,
} from "../../services/trainings/getEvaluatedTrainingService";

export interface Colaborador {
  id: number;
  nombre: string;
  nota: string;
  seguimiento: string;
  comentario: string;
  id_capacitacion: number;
}

export interface TrainingInfo {
  titulo_capacitacion: string;
  codigo_documento: string;
  tipo_capacitacion: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
}

export const useEvaluatedTraining = (codigoDocumento: string) => {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [trainingInfo, setTrainingInfo] = useState<TrainingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!codigoDocumento) {
      setColaboradores([]);
      setTrainingInfo(null);
      setError(null);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const allData: TrainingItem[] = await getEvaluatedTraining(codigoDocumento);
        console.log("📥 [useEvaluatedTraining] Datos recibidos de la API:", allData);

        if (allData.length === 0) {
          setError("No se encontraron datos de la capacitación");
          setColaboradores([]);
          setTrainingInfo(null);
          setLoading(false);
          return;
        }

        const colaboradoresFormateados: Colaborador[] = allData.map((item) => {
          console.log(`🔍 [useEvaluatedTraining] Procesando colaborador:`, {
            id_colaborador: item.id_colaborador,
            nombre: item.nombre,
            seguimiento_original: item.seguimiento,
            nota: item.nota,
            id_capacitacion: item.id_capacitacion
          });
          
          return {
            id: item.id_colaborador,
            nombre: `${item.nombre} ${item.primer_apellido} ${item.segundo_apellido}`,
            nota: item.nota ?? "",
            seguimiento: item.seguimiento ? item.seguimiento.toLowerCase() : "",
            comentario: item.comentario ?? "",
            id_capacitacion: item.id_capacitacion,
          };
        });

        console.log("✅ [useEvaluatedTraining] Colaboradores formateados:", colaboradoresFormateados);


        const first = allData[0];
        setTrainingInfo({
          titulo_capacitacion: first.titulo_capacitacion,
          codigo_documento: first.codigo_documento,
          tipo_capacitacion: first.tipo_capacitacion,
          fecha_inicio: first.fecha_inicio,
          fecha_fin: first.fecha_fin,
          estado: first.estado,
        });

        setColaboradores(colaboradoresFormateados);
        setError(null);
      } catch (err) {
        setError("No se pudieron cargar los datos de la capacitación");
        setColaboradores([]);
        setTrainingInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [codigoDocumento]);

  return {
    colaboradores,
    trainingInfo,
    loading,
    error,
    setColaboradores,
  };
};
