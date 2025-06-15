import { useEffect, useState } from 'react';
import api from '../../apiConfig/api';


type Stat = {
  area: string;
  capacitados: number;
  no_capacitados: number;
};

const StatsCards = () => {
  const [datos, setDatos] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener los datos del gráfico
  const getDataForGraphic = async () => {
    try {
      const response = await api.get('/dataForGraphic');
      return response.data; // { success, data, message }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getDataForGraphic()
      .then((res) => {
        if (res.success) {
          setDatos(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="flex flex-wrap justify-center gap-6 p-4">
      {datos.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl shadow-md p-6 w-full max-w-xs border border-green-100">
          <h3 className="text-lg font-semibold text-green-800 mb-4">{stat.area}</h3>
          
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Capacitados</span>
            <span className="font-bold text-green-700">{stat.capacitados}</span>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">No capacitados</span>
            <span className="font-bold text-red-600">{stat.no_capacitados}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;