import React from 'react';

type Stat = {
  area: string;
  certificados: number;
  no_certificados: number;
  cumplimiento: number;
};

const StatsCards = () => {
  // Static data for certification KPI
  const datos: Stat[] = [
    {
      area: "Operaciones",
      certificados: 40,
      no_certificados: 5,
      cumplimiento: 88.9
    },
    {
      area: "Logística",
      certificados: 32,
      no_certificados: 3,
      cumplimiento: 91.4
    },
    {
      area: "Calidad",
      certificados: 28,
      no_certificados: 2,
      cumplimiento: 93.3
    }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-6 p-4">
      {datos.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl shadow-md p-6 w-full max-w-xs border border-green-100">
          <h3 className="text-lg font-semibold text-green-800 mb-4">{stat.area}</h3>
          
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Certificados</span>
            <span className="font-bold text-green-700">{stat.certificados}</span>
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">No certificados</span>
            <span className="font-bold text-red-600">{stat.no_certificados}</span>
          </div>

          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Cumplimiento</span>
            <span className="font-bold text-blue-600">{stat.cumplimiento}%</span>
          </div>

          <div className="text-xs text-gray-400 mt-4">
            Última actualización: 2023-11-15
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;