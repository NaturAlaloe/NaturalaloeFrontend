import { useEffect, useState } from "react";
import api from "../apiConfig/api";

export type PolicyCompliance = {
  pct_cumplido: string;
  fecha_actualizacion: string;
};

export function usePoliciesCompliance() {
  const [policyData, setPolicyData] = useState<PolicyCompliance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPoliciesCompliance() {
      setLoading(true);
      try {
        const response = await api.get('/fullfilledPolicePercentage');
        
        if (response.data.success && response.data.data.length > 0) {
          setPolicyData(response.data.data[0]);
          setError(null);
        } else {
          setError(response.data.message || 'Error al obtener datos');
        }
      } catch (error) {
        console.error('Error fetching policies compliance:', error);
        setError('Error al obtener datos de políticas');
        setPolicyData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPoliciesCompliance();
  }, []);

  // Formatear la fecha para mostrar
  const formattedDate = policyData?.fecha_actualizacion 
    ? new Date(policyData.fecha_actualizacion).toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long' 
      })
    : "Julio 2025";

  // Porcentaje formateado
  const percentage = policyData ? `${Number(policyData.pct_cumplido).toFixed(1)}%` : "0.0%";

  return {
    policyData,
    loading,
    error,
    percentage,
    formattedDate,
  };
}