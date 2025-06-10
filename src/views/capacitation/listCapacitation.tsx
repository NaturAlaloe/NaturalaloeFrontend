import { Search } from "@mui/icons-material";
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import ApartmentIcon from '@mui/icons-material/Apartment';
import WorkIcon from '@mui/icons-material/Work';
import CloseIcon from '@mui/icons-material/Close';
import { useCapacitationList } from '../../hooks/capacitations/useCapacitationList';

//Esta vista muestra una lista de capacitaciones con un modal para ver los detalles de cada una.
export default function ListCapacitations() {
  const {
    showModal,
    setShowModal,
    colaborador,
    profesor,
    handleRowClick,
    capacitaciones,
    selectedCapacitation,
  } = useCapacitationList();

  // Lógica para mostrar el botón de reprogramar
  const showReprogramarButton =
    selectedCapacitation &&
    (selectedCapacitation.seguimiento === "Reevaluación" ||
      selectedCapacitation.seguimiento === "Reprogramar") &&
    selectedCapacitation.estado === "Finalizado";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e6f7ea]">
      <div className="p-6 bg-white rounded-lg shadow-sm w-full max-w-5xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#2AAC67] pb-2">
          Capacitaciones de la Empresa
        </h1>

        {/* Barra de búsqueda */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-[#2AAC67] sm:text-sm"
            placeholder="Buscar capacitaciones por ID y Fecha"
          />
        </div>

        {/* Tabla de capacitaciones */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#F0FFF4]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2AAC67] uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2AAC67] uppercase tracking-wider">
                  Fecha inicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2AAC67] uppercase tracking-wider">
                  Fecha final
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2AAC67] uppercase tracking-wider">
                  Comentario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2AAC67] uppercase tracking-wider">
                  Evaluado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2AAC67] uppercase tracking-wider">
                  Método
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2AAC67] uppercase tracking-wider">
                  Seguimiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2AAC67] uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {capacitaciones.map((cap, idx) => (
                <tr
                  key={cap.id}
                  className="hover:bg-[#F0FFF4] cursor-pointer"
                  onClick={() => handleRowClick(idx)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {cap.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {cap.fechaInicio}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {cap.fechaFinal}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {cap.comentario}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {cap.evaluado}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {cap.metodo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {cap.seguimiento}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {cap.estado}
                  </td>
                </tr>
              ))}
              {capacitaciones.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                    No hay capacitaciones registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal de detalles */}
        {showModal && (
          <div
            className="fixed mt-15 inset-0 flex items-center justify-center z-50"
            style={{
              backdropFilter: "blur(4px)",
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
          >
            <div className="bg-white rounded-2xl px-8 py-8 w-full max-w-3xl shadow-2xl relative border-2 border-[#2ecc71] overflow-y-auto max-h-[95vh]">
              {/* Botón cerrar */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              >
                <CloseIcon />
              </button>
              <div className="flex flex-col items-center mb-8">
                <h2 className="text-[#2ecc71] font-bold text-2xl text-center">Detalles de Capacitación</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-[#2ecc71] font-bold text-lg mb-4 text-center md:text-left">Información del Colaborador</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#2ecc71] mb-1">Nombre Completo</label>
                      <div className="flex items-center border border-[#2ecc71] rounded-lg bg-[#f6fff6] px-3 py-2">
                        <PersonIcon className="text-[#2ecc71] mr-2" />
                        <input
                          type="text"
                          value={colaborador.nombreCompleto}
                          readOnly
                          className="bg-transparent border-none p-0 text-gray-800 font-medium w-full focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#2ecc71] mb-1">Cédula</label>
                      <div className="flex items-center border border-[#2ecc71] rounded-lg bg-[#f6fff6] px-3 py-2">
                        <BadgeIcon className="text-[#2ecc71] mr-2" />
                        <input
                          type="text"
                          value={colaborador.cedula}
                          readOnly
                          className="bg-transparent border-none p-0 text-gray-800 font-medium w-full focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#2ecc71] mb-1">Departamento</label>
                      <div className="flex items-center border border-[#2ecc71] rounded-lg bg-[#f6fff6] px-3 py-2">
                        <ApartmentIcon className="text-[#2ecc71] mr-2" />
                        <input
                          type="text"
                          value={colaborador.departamento}
                          readOnly
                          className="bg-transparent border-none p-0 text-gray-800 font-medium w-full focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#2ecc71] mb-1">Puesto</label>
                      <div className="flex items-center border border-[#2ecc71] rounded-lg bg-[#f6fff6] px-3 py-2">
                        <WorkIcon className="text-[#2ecc71] mr-2" />
                        <input
                          type="text"
                          value={colaborador.puesto}
                          readOnly
                          className="bg-transparent border-none p-0 text-gray-800 font-medium w-full focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-[#2ecc71] font-bold text-lg mb-4 text-center md:text-left mt-8 md:mt-0">Información del Profesor</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#2ecc71] mb-1">Nombre</label>
                      <div className="flex items-center border border-[#2ecc71] rounded-lg bg-[#f6fff6] px-3 py-2">
                        <PersonIcon className="text-[#2ecc71] mr-2" />
                        <input
                          type="text"
                          value={profesor.nombre}
                          readOnly
                          className="bg-transparent border-none p-0 text-gray-800 font-medium w-full focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#2ecc71] mb-1">Apellido</label>
                      <div className="flex items-center border border-[#2ecc71] rounded-lg bg-[#f6fff6] px-3 py-2">
                        <PersonIcon className="text-[#2ecc71] mr-2" />
                        <input
                          type="text"
                          value={profesor.apellido}
                          readOnly
                          className="bg-transparent border-none p-0 text-gray-800 font-medium w-full focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#2ecc71] mb-1">Identificación</label>
                      <div className="flex items-center border border-[#2ecc71] rounded-lg bg-[#f6fff6] px-3 py-2">
                        <BadgeIcon className="text-[#2ecc71] mr-2" />
                        <input
                          type="text"
                          value={profesor.identificacion}
                          readOnly
                          className="bg-transparent border-none p-0 text-gray-800 font-medium w-full focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {showReprogramarButton && (
                <div className="flex justify-center mt-8">
                  <button
                    className="bg-[#2ecc71] text-white font-bold rounded-full px-8 py-3 text-lg shadow-md hover:bg-[#27ae60] transition"
                    onClick={() => {
                      alert("Funcionalidad de reprogramación aún no implementada.");
                      setShowModal(false);
                    }}
                  >
                    Reprogramar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
