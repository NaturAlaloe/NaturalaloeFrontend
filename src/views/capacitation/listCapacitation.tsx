import { Search, Person, Badge, Apartment, Work, Close, Info, EditNote } from "@mui/icons-material";
import { useState } from 'react';
import GlobalDataTable from '../../components/globalComponents/GlobalDataTable';
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
    seguimientoFilter,
    setSeguimientoFilter,
    poes,
    estados,
    seguimientos,
    showModal,
    setShowModal,
    selectedCapacitation,
    handleRowClick,
    navegarCapacitacionFinalizada,
  } = useCapacitationList();

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentToShow, setCommentToShow] = useState<string | null>(null);

  const columns = [
    {
      name: 'ID',
      selector: (row: any) => row.id,
      sortable: true,
      cell: (row: any) => <div className="text-sm text-gray-700">{row.id}</div>,
    },
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
    },
    {
      name: 'DURACIÓN (h)',
      selector: (row: any) => row.duracion,
      sortable: true,
      cell: (row: any) => <div className="text-sm text-gray-700">{row.duracion}</div>,
      wrap: true,
    },
    {
      name: 'COMENTARIO',
      selector: (row: any) => row.comentario,
      sortable: false,
      cell: (row: any) => (
        <button
          className="text-[#2AAC67] underline hover:text-[#1e8449] text-xs"
          onClick={e => {
            e.stopPropagation();
            setCommentToShow(row.comentario);
            setShowCommentModal(true);
          }}
        >
          Ver comentario
        </button>
      ),
      wrap: true,
    },
    {
      name: 'FECHA INICIO',
      selector: (row: any) => row.fechaInicio,
      sortable: true,
      cell: (row: any) => <div className="text-sm text-gray-700">{row.fechaInicio}</div>,

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
      name: 'SEGUIMIENTO',
      selector: (row: any) => row.seguimiento,
      sortable: true,
      cell: (row: any) => <div className="text-sm text-gray-700">{row.seguimiento}</div>,
      wrap: true,
    },
    {
      name: 'ACCIONES',
      cell: () => (
        <div className="flex flex-col sm:flex-row gap-2 items-center justify-center">
          <button
            className="action-button text-[#2AAC67] hover:text-[#1e8449] transition-colors font-semibold"
            onClick={navegarCapacitacionFinalizada}
            title="Calificar examen"
          >
            <EditNote />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="p-4 bg-white">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#2AAC67] pb-2">
        Capacitaciones de la Empresa
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
          <option value="">Todos los POE</option>
          {poes.map((poe) => (
            <option key={poe} value={poe}>{poe}</option>
          ))}
        </select>
        <select
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-[#2AAC67]"
          value={estadoFilter}
          onChange={e => setEstadoFilter(e.target.value)}
        >
          <option value="">Todos los estados</option>
          {estados.map((estado) => (
            <option key={estado} value={estado}>{estado}</option>
          ))}
        </select>
        <select
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-[#2AAC67]"
          value={seguimientoFilter}
          onChange={e => setSeguimientoFilter(e.target.value)}
        >
          <option value="">Todos los seguimientos</option>
          {seguimientos.map((seg) => (
            <option key={seg} value={seg}>{seg}</option>
          ))}
        </select>
      </div>
      <div className="border border-gray-200 rounded-lg overflow-x-auto">
        <GlobalDataTable
          columns={columns}
          data={capacitations}
          rowsPerPage={10}
          dense
          highlightOnHover
          noDataComponent={<div className="px-6 py-4 text-center text-sm text-gray-500">No se encontraron capacitaciones</div>}
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
      {showModal && selectedCapacitation && (
        <div
          className="fixed mt-15 inset-0 flex items-center justify-center z-50"
          style={{
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        >
          <div className="bg-white rounded-2xl px-8 py-8 w-full max-w-3xl shadow-2xl relative border-2 border-[#2ecc71] overflow-y-auto max-h-[95vh]">
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-[#2ecc71] font-bold text-lg mb-4 text-center md:text-left">Información de los Colaboradores</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#2ecc71] mb-1">Nombre Completo</label>
                    <div className="flex items-center border border-[#2ecc71] rounded-lg bg-[#f6fff6] px-3 py-2">
                      <Person className="text-[#2ecc71] mr-2" />
                      <input
                        type="text"
                        value={selectedCapacitation.colaborador.nombreCompleto}
                        readOnly
                        className="bg-transparent border-none p-0 text-gray-800 font-medium w-full focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#2ecc71] mb-1">Cédula</label>
                    <div className="flex items-center border border-[#2ecc71] rounded-lg bg-[#f6fff6] px-3 py-2">
                      <Badge className="text-[#2ecc71] mr-2" />
                      <input
                        type="text"
                        value={selectedCapacitation.colaborador.cedula}
                        readOnly
                        className="bg-transparent border-none p-0 text-gray-800 font-medium w-full focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#2ecc71] mb-1">Departamento</label>
                    <div className="flex items-center border border-[#2ecc71] rounded-lg bg-[#f6fff6] px-3 py-2">
                      <Apartment className="text-[#2ecc71] mr-2" />
                      <input
                        type="text"
                        value={selectedCapacitation.colaborador.departamento}
                        readOnly
                        className="bg-transparent border-none p-0 text-gray-800 font-medium w-full focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#2ecc71] mb-1">Puesto</label>
                    <div className="flex items-center border border-[#2ecc71] rounded-lg bg-[#f6fff6] px-3 py-2">
                      <Work className="text-[#2ecc71] mr-2" />
                      <input
                        type="text"
                        value={selectedCapacitation.colaborador.puesto}
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
                      <Person className="text-[#2ecc71] mr-2" />
                      <input
                        type="text"
                        value={selectedCapacitation.profesor.nombre}
                        readOnly
                        className="bg-transparent border-none p-0 text-gray-800 font-medium w-full focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#2ecc71] mb-1">Apellido</label>
                    <div className="flex items-center border border-[#2ecc71] rounded-lg bg-[#f6fff6] px-3 py-2">
                      <Person className="text-[#2ecc71] mr-2" />
                      <input
                        type="text"
                        value={selectedCapacitation.profesor.apellido}
                        readOnly
                        className="bg-transparent border-none p-0 text-gray-800 font-medium w-full focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#2ecc71] mb-1">Identificación</label>
                    <div className="flex items-center border border-[#2ecc71] rounded-lg bg-[#f6fff6] px-3 py-2">
                      <Badge className="text-[#2ecc71] mr-2" />
                      <input
                        type="text"
                        value={selectedCapacitation.profesor.identificacion}
                        readOnly
                        className="bg-transparent border-none p-0 text-gray-800 font-medium w-full focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
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
          title="Comentario completo"
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
