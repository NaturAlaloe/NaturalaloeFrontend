import { Search, Person, Badge, Apartment, Work, Close, Info, EditNote, ChatBubble } from "@mui/icons-material";
import { useState } from 'react';
import GlobalDataTable from '../../components/globalComponents/GlobalDataTable';
import FullScreenSpinner from '../../components/globalComponents/FullScreenSpinner';
import { useCapacitationList } from '../../hooks/capacitations/useCapacitationList';
import SimpleModal from "../../components/globalComponents/SimpleModal";

export default function ListCapacitations() {
  const {
    capacitations,
    searchTerm,
    setSearchTerm,
    poeFilter,
    setPoeFilter,
    estadoFilter,
    setEstadoFilter,
    tipoFilter,
    setTipoFilter,
    seguimientoFilter,
    setSeguimientoFilter,
    poes,
    estados,
    tipos,
    seguimientos,
    showModal,
    setShowModal,
    selectedCapacitation,
    handleRowClick,
    navegarCapacitacionFinalizada,
    isLoading,
     } = useCapacitationList();

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentToShow, setCommentToShow] = useState<string | null>(null);

  if (isLoading) return <FullScreenSpinner />;

  const columns = [
    {
      name: 'POE',
      selector: (row: any) => row.poe,
      sortable: true,
      cell: (row: any) => <div className="text-sm font-medium text-gray-900">{row.poe}</div>,
      wrap: true,
    },
    {
      name: 'TÍTULO',
      selector: (row: any) => row.titulo,
      sortable: true,
      cell: (row: any) => <div className="text-sm text-gray-700">{row.titulo}</div>,
      wrap: true,
    }, {
      name: 'DURACIÓN (h)',
      selector: (row: any) => row.duracion,
      sortable: true,
      cell: (row: any) => <div className="text-sm text-gray-700">{row.duracion}</div>,
      wrap: true,
    },
    {
      name: 'FECHA FINAL',
      selector: (row: any) => row.fechaFinal,
      sortable: true,
      cell: (row: any) => <div className="text-sm text-gray-700">{row.fechaFinal}</div>,

    },
    {
      name: 'ESTADO',
      selector: (row: any) => row.estado,
      sortable: true,
      cell: (row: any) => <div className="text-sm text-gray-700">{row.estado}</div>,
      wrap: true,
    },
    {
      name: 'TIPO',
      selector: (row: any) => row.tipo,
      sortable: true,
      cell: (row: any) => <div className="text-sm text-gray-700">{row.tipo}</div>,
      wrap: true,
    },
    {
      name: 'SEGUIMIENTO',
      selector: (row: any) => row.seguimiento,
      sortable: true,
      cell: (row: any) => <div className="text-sm text-gray-700">{row.seguimiento}</div>,
      wrap: true,
    },
    {
      name: 'ACCIONES',
      cell: (row: any) => (
        <div className="flex flex-col sm:flex-row gap-2 items-center justify-center">          <button
            className="action-button text-[#2AAC67] hover:text-[#1e8449] transition-colors font-semibold"
            onClick={() => navegarCapacitacionFinalizada(row.poe)}
            title="Calificar examen"
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
    },
  ];
  return (
    <div className="p-4 bg-white rounded-lg ">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#2AAC67] pb-2">
        Capacitaciones de la Empresa
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-[#2AAC67] sm:text-sm"
            placeholder="Buscar por POE, estado o seguimiento..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-[#2AAC67]"
          value={poeFilter}
          onChange={e => setPoeFilter(e.target.value)}
        >
          <option value="">POE</option>
          {poes.map((poe) => (
            <option key={poe} value={poe}>{poe}</option>
          ))}
        </select>        <select
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-[#2AAC67]"
          value={estadoFilter}
          onChange={e => setEstadoFilter(e.target.value)}
        >
          <option value="">Estados</option>
          {estados.map((estado) => (
            <option key={estado} value={estado}>{estado}</option>
          ))}
        </select>
        <select
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-[#2AAC67]"
          value={tipoFilter}
          onChange={e => setTipoFilter(e.target.value)}
        >
          <option value="">Tipos</option>
          {tipos.map((tipo) => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>
        <select
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-[#2AAC67]"
          value={seguimientoFilter}
          onChange={e => setSeguimientoFilter(e.target.value)}
        >
          <option value="">Seguimientos</option>
          {seguimientos.map((seg) => (
            <option key={seg} value={seg}>{seg}</option>
          ))}
        </select>      </div>
   
      <div className="border border-gray-200 rounded-lg overflow-x-auto">
        <GlobalDataTable
          columns={columns}
          data={capacitations}
          pagination={true}
          rowsPerPage={10}
          dense
          highlightOnHover
          noDataComponent={
            <div className="px-6 py-4 text-center text-sm text-gray-500">
              {isLoading ? "Cargando capacitaciones..." : "No se encontraron capacitaciones"}
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
      {showModal && selectedCapacitation && (
        <div
          className="fixed mt-15 inset-0 flex items-center justify-center z-50"
          style={{
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        >
          <div className="bg-white rounded-2xl px-8 py-8 w-full max-w-3xl shadow-2xl relative  overflow-y-auto max-h-[95vh]">
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
              <h2 className="text-[#2ecc71] font-bold text-2xl text-center">Detalles de Capacitación</h2>
            </div>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-[#2ecc71] font-bold text-lg mb-4 text-center md:text-left">
                  Información de los Colaboradores
                </h3>
                <div className="space-y-3">
                  {selectedCapacitation.colaboradores.map((colaborador, index) => (
                    <details key={index} className="rounded-lg border border-[#2ecc71] bg-[#f6fff6]">
                      <summary className="flex items-center px-3 py-2 cursor-pointer select-none font-semibold text-[#2ecc71]">
                        <Person className="mr-2" />
                        {colaborador.nombreCompleto}
                        <span className="ml-auto text-[#2ecc71]">▼</span>
                      </summary>
                      <div className="px-3 pb-3 pt-2">
                        <div className="mb-2 flex items-center">
                          <Badge className="mr-2 text-[#2ecc71]" />
                          <span className="font-semibold mr-1">Cédula:</span> {colaborador.cedula}
                        </div>
                        <div className="mb-2 flex items-center">
                          <Apartment className="mr-2 text-[#2ecc71]" />
                          <span className="font-semibold mr-1">Departamento:</span> {colaborador.departamento}
                        </div>
                        <div className="mb-2 flex items-center">
                          <Work className="mr-2 text-[#2ecc71]" />
                          <span className="font-semibold mr-1">Puesto:</span> {colaborador.puesto}
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-[#2ecc71] font-bold text-lg mb-4 text-center md:text-left mt-8 md:mt-0">Información del Profesor</h3>
                <div className="mb-4">
                  <details className="rounded-lg border border-[#2ecc71] bg-[#f6fff6]">
                    <summary className="flex items-center px-3 py-2 cursor-pointer select-none font-semibold text-[#2ecc71]">
                      <Person className="mr-2" />
                      {selectedCapacitation.profesor.nombre} {selectedCapacitation.profesor.apellido}
                      <span className="ml-auto">▼</span>
                    </summary>
                    <div className="px-3 pb-3 pt-2">
                      <div className="mb-2 flex items-center"><Badge className="mr-2 text-[#2ecc71]" /> <span className="font-semibold mr-1">Identificación:</span> {selectedCapacitation.profesor.identificacion}</div>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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