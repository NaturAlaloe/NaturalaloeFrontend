import { useEffect, useState } from "react";
import { getTrainingByIdService, saveEvaluationsService, type SaveEvaluationData } from "../../services/capacitations/getEvaluatedCapacitationService";

export interface Colaborador {
  id: number;
  id_colaborador: number;
  id_capacitacion: number;
  nombre: string;
  nota: string;
  seguimiento: string;
  comentario: string;
}

export interface TrainingInfo {
  id_capacitacion: number;
  titulo_capacitacion: string;
  fecha_inicio: string;
  fecha_fin: string;
  tipo_capacitacion: string;
  estado: string;
  codigo_documento: string;
}

export const useEvaluatedTraining = (codigoDocumento: string) => {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [trainingInfo, setTrainingInfo] = useState<TrainingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!codigoDocumento) {
      setColaboradores([]);
      setTrainingInfo(null);
      setLoading(false);
      return;
    }

    const fetchTrainingData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getTrainingByIdService(codigoDocumento);

        if (data && data.length > 0) {
          const firstRecord = data[0];
          setTrainingInfo({
            id_capacitacion: firstRecord.id_capacitacion,
            titulo_capacitacion: firstRecord.titulo_capacitacion,
            fecha_inicio: firstRecord.fecha_inicio,
            fecha_fin: firstRecord.fecha_fin,
            tipo_capacitacion: firstRecord.tipo_capacitacion,
            estado: firstRecord.estado,
            codigo_documento: firstRecord.codigo_documento,
          });

          const collaboratorsData = data.map((item, index) => ({
            id: index + 1,
            id_colaborador: item.id_colaborador,
            id_capacitacion: item.id_capacitacion,
            nombre:
              `${item.nombre} ${item.primer_apellido} ${item.segundo_apellido}`.trim(),
            nota: "",
            seguimiento: item.seguimiento || "en progreso",
            comentario: "",
          }));

          setColaboradores(collaboratorsData);
        } else {
          setColaboradores([]);
          setTrainingInfo(null);
        }
      } catch (err) {
        console.error("Error fetching training data:", err);
        setError("No se pudieron cargar los datos de la capacitación");
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingData();
  }, [codigoDocumento]);

  const saveEvaluations = async (): Promise<boolean> => {
    if (colaboradores.length === 0) {
      throw new Error("No hay colaboradores para evaluar");
    }

    setSaving(true);
    try {
      const evaluationsData: SaveEvaluationData[] = colaboradores.map(
        (colaborador) => ({
          id_colaborador: colaborador.id_colaborador,
          id_capacitacion: colaborador.id_capacitacion,
          nota: colaborador.nota,
          seguimiento: colaborador.seguimiento,
          comentario: colaborador.comentario,
        })
      );

      const success = await saveEvaluationsService(evaluationsData);
      return success;
    } catch (error) {
      console.error("Error saving evaluations:", error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return {
    colaboradores,
    trainingInfo,
    loading,
    error,
    saving,
    setColaboradores,
    saveEvaluations,
  };
};
