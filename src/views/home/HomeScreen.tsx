import ChartSelector from '../../components/home/ChartSelector';

const kpiList = [
  { label: 'Procedimientos Actualizados', value: '87.0%', trend: '+1.5%', color: 'bg-green-50 text-green-700' },
  { label: 'Políticas Actualizadas', value: '95.0%', trend: '+2.5%', color: 'bg-yellow-50 text-yellow-700' },
  { label: 'Capacitaciones Completadas', value: '90.0%', trend: '+3.0%', color: 'bg-blue-50 text-blue-700' },
];

const colaboradoresPendientes = [
  { nombre: 'Jenny Wilson', area: 'Operaciones', estado: 'Pendiente', fecha: '2023-11-15', capacitacion: 'Seguridad' },
  { nombre: 'Guy Hawkins', area: 'Logística', estado: 'Pendiente', fecha: '2023-11-15', capacitacion: 'Manipulación' },
  { nombre: 'Ralph Edwards', area: 'Calidad', estado: 'Pendiente', fecha: '2023-11-15', capacitacion: 'Normas ISO' },
];

export default function HomeScreen() {
  return (
    
    <div className="min-h-screen bg-[#FFF] px-6 py-8 rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800">Dashboard de Indicadores</h1>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        {/* Chart - Large Card */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-gray-300 shadow p-6 flex flex-col justify-between transition hover:shadow-lg">
          <div className="flex-1">
            <ChartSelector initialKpi="certification" />
          </div>
        </div>
        {/* KPI Cards in column */}
        <div className="flex flex-col gap-5">
          {kpiList.map((kpi, idx) => (
            <div
              key={idx}
              className={`
                rounded-xl shadow-gray-300 shadow p-6 flex flex-col justify-between items-start border-l-4 border-green-600 bg-white
                cursor-pointer transition
                hover:bg-green-50 hover:shadow-lg
                relative
              `}
              onClick={() => {
                // Aquí puedes navegar o abrir el apartado correspondiente
              }}
            >
              <span className="text-gray-500 text-sm mb-2">{kpi.label}</span>
              <span className="text-2xl font-bold mb-1 text-green-800">{kpi.value}</span>
              {/* Puedes agregar aquí una breve descripción o dato extra */}
              <span className="text-xs text-gray-400 mb-2">
                Última actualización: Julio 2025
              </span>
              <div className="flex w-full justify-end mt-4">
                <button
                  className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-semibold hover:bg-green-200 transition"
                  onClick={e => {
                    e.stopPropagation();
                    // Aquí puedes navegar o abrir el apartado correspondiente
                  }}
                >
                  
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pendientes a capacitación - Table */}
      <div className="bg-white rounded-xl shadow-gray-300 shadow p-6 transition hover:shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-green-800">Pendientes a capacitación</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-y-1">
            <thead>
              <tr className="text-green-700 bg-green-50">
                <th className="py-2 px-3 text-left rounded-l-lg">Nombre</th>
                <th className="py-2 px-3 text-left">Área</th>
                <th className="py-2 px-3 text-left">Capacitación</th>
                <th className="py-2 px-3 text-left">Estado</th>
                <th className="py-2 px-3 text-left rounded-r-lg">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {colaboradoresPendientes.map((col, idx) => (
                <tr
                  key={idx}
                  className="bg-[#F6F8FA] hover:bg-green-100 transition rounded-lg shadow hover:shadow-lg"
                >
                  <td className="py-2 px-3 font-medium text-green-900 rounded-l-lg">{col.nombre}</td>
                  <td className="py-2 px-3 text-green-800">{col.area}</td>
                  <td className="py-2 px-3">
                    <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">
                      {col.capacitacion}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-semibold">
                      {col.estado}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-gray-500 rounded-r-lg">{col.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-4">
            <a
            href="/home/pendingTrainingsScreen"
            className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold hover:bg-green-200 transition"
            >
            Ver Todos
            </a>
        </div>
      </div>
    </div>
  );
}