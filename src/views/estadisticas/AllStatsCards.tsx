import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../../components/globalComponents/SearchBarTable";

type Stat = {
  area: string;
  type: 'certification' | 'procedures' | 'training' | 'update';
  metric1: number;
  metric2: number;
  percentage: number;
  lastUpdate: string;
};

const allStats: Stat[] = [
  // Certification data
  { area: "Operaciones", type: 'certification', metric1: 40, metric2: 5, percentage: 88.9, lastUpdate: "2023-11-15" },
  { area: "Logística", type: 'certification', metric1: 32, metric2: 3, percentage: 91.4, lastUpdate: "2023-11-15" },
  { area: "Calidad", type: 'certification', metric1: 28, metric2: 2, percentage: 93.3, lastUpdate: "2023-11-15" },
  
  // Procedures data
  { area: "Operaciones", type: 'procedures', metric1: 20, metric2: 3, percentage: 87.0, lastUpdate: "2023-11-15" },
  { area: "Logística", type: 'procedures', metric1: 12, metric2: 2, percentage: 85.7, lastUpdate: "2023-11-15" },
  { area: "Calidad", type: 'procedures', metric1: 10, metric2: 3, percentage: 76.9, lastUpdate: "2023-11-15" },
  
  // Training data
  { area: "Operaciones", type: 'training', metric1: 85, metric2: 15, percentage: 85.0, lastUpdate: "2023-11-15" },
  { area: "Logística", type: 'training', metric1: 90, metric2: 10, percentage: 90.0, lastUpdate: "2023-11-15" },
  { area: "Calidad", type: 'training', metric1: 95, metric2: 5, percentage: 95.0, lastUpdate: "2023-11-15" },
  
  // Update data (global, not by area)
  { area: "General", type: 'update', metric1: 42, metric2: 8, percentage: 84.0, lastUpdate: "2023-11-15" }
];

type Filtro = "ninguno" | "mayor" | "menor" | "reciente" | "vieja" | "tipo";

const typeOptions = [
  { value: 'all', label: 'Todos los tipos' },
  { value: 'certification', label: 'Certificación' },
  { value: 'procedures', label: 'Procedimientos' },
  { value: 'training', label: 'Capacitaciones' },
  { value: 'update', label: 'Actualización' }
];

const getLabels = (type: string) => {
  switch(type) {
    case 'certification':
      return { metric1: 'Certificados', metric2: 'No certificados', title: 'Certificación' };
    case 'procedures':
      return { metric1: 'Actualizados', metric2: 'Obsoletos', title: 'Procedimientos' };
    case 'training':
      return { metric1: 'Completadas', metric2: 'Pendientes', title: 'Capacitaciones' };
    case 'update':
      return { metric1: 'A tiempo', metric2: 'Atrasados', title: 'Actualización' };
    default:
      return { metric1: 'Metric 1', metric2: 'Metric 2', title: 'Indicador' };
  }
};

const AllStatsCards = () => {
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("ninguno");
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const datosFiltrados = useMemo(() => {
    let filtrados = allStats.filter(stat =>
      stat.area.toLowerCase().includes(search.toLowerCase()) &&
      (selectedType === "all" || stat.type === selectedType)
    );

    switch (filtro) {
      case "mayor":
        return [...filtrados].sort((a, b) => b.percentage - a.percentage);
      case "menor":
        return [...filtrados].sort((a, b) => a.percentage - b.percentage);
      case "reciente":
        return [...filtrados].sort((a, b) => b.lastUpdate.localeCompare(a.lastUpdate));
      case "vieja":
        return [...filtrados].sort((a, b) => a.lastUpdate.localeCompare(b.lastUpdate));
      case "tipo":
        return [...filtrados].sort((a, b) => a.type.localeCompare(b.type));
      default:
        return filtrados;
    }
  }, [search, filtro, selectedType]);

  return (
    <div className="flex flex-col items-center pt-8 pb-12 min-h-screen bg-[#f4fcec]">
      <h2 className="text-3xl font-bold text-green-800 mb-8 mt-4 text-center">
        Todas las Estadísticas
      </h2>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6 w-full max-w-4xl justify-center items-center">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar área..."
          className="w-full md:w-72"
        />
        <select
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-[#2AAC67]"
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
        >
          {typeOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <select
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-[#2AAC67]"
          value={filtro}
          onChange={e => setFiltro(e.target.value as Filtro)}
        >
          <option value="ninguno">Sin filtro</option>
          <option value="mayor">Mayor % Cumplimiento</option>
          <option value="menor">Menor % Cumplimiento</option>
          <option value="reciente">Fecha más reciente</option>
          <option value="vieja">Fecha más antigua</option>
          <option value="tipo">Orden por tipo</option>
        </select>
      </div>

      <div className="flex flex-wrap justify-center gap-8 p-4 w-full max-w-6xl">
        {datosFiltrados.map((stat, index) => {
          const labels = getLabels(stat.type);
          return (
            <div
              key={`${stat.area}-${stat.type}-${index}`}
              className="bg-white rounded-2xl shadow-md p-8 w-full md:w-1/3 max-w-xs border border-green-100 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-green-800 mb-2">{stat.area}</h3>
                <span className="text-sm font-semibold text-blue-600 mb-4 block">{labels.title}</span>
              </div>
              <div className="mb-2 flex justify-between">
                <span className="text-base text-gray-700">{labels.metric1}</span>
                <span className="font-bold text-green-700">{stat.metric1}</span>
              </div>
              <div className="mb-2 flex justify-between">
                <span className="text-base text-gray-700">{labels.metric2}</span>
                <span className="font-bold text-red-600">{stat.metric2}</span>
              </div>
              <div className="mb-2 flex justify-between">
                <span className="text-base text-gray-700">Cumplimiento</span>
                <span className="font-bold text-blue-700">
                  {stat.percentage}%
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-6">
                Última actualización: {stat.lastUpdate}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 mt-8">
        <Link
          to="/"
          className="px-8 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition text-lg"
        >
          Volver al inicio
        </Link>
      
      </div>
    </div>
  );
};

export default AllStatsCards;