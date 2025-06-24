import { Search, Person, Badge, Apartment, Work, Close, Info } from "@mui/icons-material";
import { useState } from 'react';
import GlobalDataTable from '../../components/globalComponents/GlobalDataTable';
import FullScreenSpinner from '../../components/globalComponents/FullScreenSpinner';
import { useCapacitationGeneralList } from '../../hooks/capacitations/useCapacitationGeneralList';
import SimpleModal from "../../components/globalComponents/SimpleModal";

export default function ListCapacitationGeneral() {
  const {
    capacitations,
    searchTerm,
    setSearchTerm,
    estadoFilter,
    setEstadoFilter,
    estados,
    showModal,
    setShowModal,
    selectedCapacitation,
    handleRowClick,
    isLoading,
    error,
    loadCapacitationsGeneral,
  } = useCapacitationGeneralList();

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentToShow] = useState<string | null>(null);

  if (isLoading) return <FullScreenSpinner />;

  const columns = [
    {
      name: 'ID',
      selector: (row: any) => row.id,
      sortable: true,
      cell: (row: any) => <div className="text-sm font-medium text-gray-900">{row.id}</div>,
      wrap: true,
      width: '120px',
    },
    {
      name: 'TÍTULO',
      selector: (row: any) => row.titulo,
      sortable: true,
      cell: (row: any) => <div className="text-sm text-gray-700">{row.titulo}</div>,
      wrap: true,
    },
    {
      name: 'Fecha Creación',
      selector: (row: any) => row.fechaCreacion,
      sortable: true,
      cell: (row: any) => <div className="text-sm text-gray-700">{row.fechaCreacion}</div>,
      wrap: true,
    },

  ];
  return (
    <div className="p-4 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 border-b-2 border-[#2AAC67] pb-2">
          Capacitaciones Generales
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-[#2AAC67] sm:text-sm"
            placeholder="Buscar por título, ID o estado..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-[#2AAC67]"
          value={estadoFilter}
          onChange={e => setEstadoFilter(e.target.value)}
        >
          <option value="">Todos los Estados</option>
          {estados.map((estado) => (
            <option key={estado} value={estado}>{estado}</option>
          ))}        </select>
      </div>

      {/* Indicador de carga */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2AAC67]"></div>
          <span className="ml-2 text-gray-600">Cargando capacitaciones generales...</span>
        </div>
      )}

      {/* Manejo de errores */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <div className="text-red-600 font-medium">Error al cargar capacitaciones generales</div>
            <button
              onClick={() => loadCapacitationsGeneral()}
              className="ml-auto px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Reintentar
            </button>
          </div>
          <div className="text-red-600 text-sm mt-1">{error}</div>
        </div>
      )}

      <div className="border border-gray-200 rounded-lg overflow-x-auto">
        <GlobalDataTable
          columns={columns}
          data={capacitations}
          rowsPerPage={10}
          dense
          highlightOnHover
          noDataComponent={
            <div className="px-6 py-4 text-center text-sm text-gray-500">
              {isLoading ? "Cargando capacitaciones generales..." : "No se encontraron capacitaciones generales"}
            </div>
          }
          customStyles={{
            headCells: {
              style: {
                background: "#F0FFF4",
                color: "#2AAC67",
                fontWeight: "bold",
                fontSize: "13px",
                textTransform: "uppercase",
              },
            },
          }}
          onRowClicked={handleRowClick}
          progressPending={isLoading}
        />
      </div>
      {/* Modal de detalles */}
      {showModal && selectedCapacitation && (
        <div
          className="fixed mt-15 inset-0 flex items-center justify-center z-50"
          style={{
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        >
          <div className="bg-white rounded-2xl px-8 py-8 w-full max-w-4xl shadow-2xl relative overflow-y-auto max-h-[95vh]">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <Close />
            </button>

            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#2ecc71]/10 mb-2">
                <Info className="text-[#2ecc71]" style={{ fontSize: 36 }} />
              </div>
              <h2 className="text-[#2ecc71] font-bold text-2xl text-center">
                Detalles de Capacitación General
              </h2>
            </div>
            <div>
              <h3 className="text-[#2ecc71] font-bold text-lg mb-4">Colaboradores Asignados</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                {selectedCapacitation.colaboradores.map((colaborador) => (
                  <div key={colaborador.id} className="border border-[#2ecc71] rounded-lg p-3 bg-[#f6fff6]">
                    <div className="flex items-center mb-2">
                      <Person className="mr-2 text-[#2ecc71]" />
                      <span className="font-semibold text-[#2ecc71]">{colaborador.nombre}</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center">
                        <Badge className="mr-2 text-[#2ecc71] text-sm" />
                        <span className="font-medium">Cédula:</span>
                        <span className="ml-1 text-gray-600">{colaborador.cedula}</span>
                      </div>
                      <div className="flex items-center">
                        <Work className="mr-2 text-[#2ecc71] text-sm" />
                        <span className="font-medium">Puesto:</span>
                        <span className="ml-1 text-gray-600">{colaborador.puesto}</span>
                      </div>
                      <div className="flex items-center">
                        <Apartment className="mr-2 text-[#2ecc71] text-sm" />
                        <span className="font-medium">Departamento:</span>
                        <span className="ml-1 text-gray-600">{colaborador.departamento}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal de comentario */}
      {showCommentModal && (
        <SimpleModal
          open={showCommentModal}
          onClose={() => setShowCommentModal(false)}
          title="Comentario"
          widthClass="max-w-md w-full"
        >
          <div className="text-gray-800 text-sm whitespace-pre-line break-words">
            {commentToShow}
          </div>
        </SimpleModal>
      )}
    </div>
  );
}
