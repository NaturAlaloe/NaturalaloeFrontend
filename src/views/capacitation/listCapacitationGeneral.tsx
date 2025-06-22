import { Search, Person, Badge, Apartment, Work, Close, Info, EditNote, ChatBubble, Add } from "@mui/icons-material";
import { useState } from 'react';
import GlobalDataTable from '../../components/globalComponents/GlobalDataTable';
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
    navegarCapacitacionGeneral,
  } = useCapacitationGeneralList();

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentToShow, setCommentToShow] = useState<string | null>(null);

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
      name: 'FECHA CREACIÓN',
      selector: (row: any) => row.fechaCreacion,
      sortable: true,
      cell: (row: any) => <div className="text-sm text-gray-700">{row.fechaCreacion}</div>,
      width: '150px',
    },
    {
      name: 'ESTADO',
      selector: (row: any) => row.estado,
      sortable: true,
      cell: (row: any) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          row.estado === 'Activo' ? 'bg-green-100 text-green-800' :
          row.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {row.estado}
        </span>
      ),
      wrap: true,
      width: '120px',
    },
    {
      name: 'COLABORADORES',
      selector: (row: any) => row.colaboradoresAsignados,
      sortable: true,
      cell: (row: any) => (
        <div className="text-sm text-center text-gray-700 font-medium">
          {row.colaboradoresAsignados}
        </div>
      ),
      width: '130px',
    },
    {
      name: 'ACCIONES',
      cell: (row: any) => (
        <div className="flex flex-col sm:flex-row gap-2 items-center justify-center">
          <button
            className="action-button text-[#2AAC67] hover:text-[#1e8449] transition-colors font-semibold"
            onClick={() => navegarCapacitacionGeneral()}
            title="Editar capacitación"
          >
            <EditNote />
          </button>
          <button
            className="text-[#2AAC67] hover:text-[#1e8449] transition-colors"
            onClick={() => {
              setCommentToShow(row.comentario);
              setShowCommentModal(true);
            }}
            title="Ver comentario"
          >
            <ChatBubble />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '120px',
    },
  ];

  return (
    <div className="p-4 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 border-b-2 border-[#2AAC67] pb-2">
          Capacitaciones Generales
        </h1>
        <button
          onClick={navegarCapacitacionGeneral}
          className="bg-[#2AAC67] text-white px-4 py-2 rounded-lg hover:bg-[#24965c] transition-colors flex items-center gap-2"
        >
          <Add />
          Nueva Capacitación General
        </button>
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
          ))}
        </select>

        <div className="text-sm text-gray-600 flex items-center">
          Total: {capacitations.length} capacitaciones
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-x-auto">
        <GlobalDataTable
          columns={columns}
          data={capacitations}
          rowsPerPage={10}
          dense
          highlightOnHover
          noDataComponent={
            <div className="px-6 py-4 text-center text-sm text-gray-500">
              No se encontraron capacitaciones generales
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-[#2ecc71] font-bold text-lg mb-3">Información General</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-gray-700">ID:</span>
                    <span className="ml-2 text-gray-600">{selectedCapacitation.id}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Título:</span>
                    <span className="ml-2 text-gray-600">{selectedCapacitation.titulo}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Fecha de Creación:</span>
                    <span className="ml-2 text-gray-600">{selectedCapacitation.fechaCreacion}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Estado:</span>
                    <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedCapacitation.estado === 'Activo' ? 'bg-green-100 text-green-800' :
                      selectedCapacitation.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedCapacitation.estado}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Total Colaboradores:</span>
                    <span className="ml-2 text-gray-600">{selectedCapacitation.colaboradoresAsignados}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[#2ecc71] font-bold text-lg mb-3">Comentario</h3>
                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                  {selectedCapacitation.comentario}
                </div>
              </div>
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
