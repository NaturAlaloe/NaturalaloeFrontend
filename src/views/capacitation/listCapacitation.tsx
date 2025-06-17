import type { TableColumn } from 'react-data-table-component';

import { Search, Person, Badge, Apartment, Work, Close, Info, EditNote } from "@mui/icons-material";
import DataTable from 'react-data-table-component';
import { useState } from 'react';
import { useCapacitationList, type Capacitation } from '../../hooks/capacitations/useCapacitationList';


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
    currentPage,
    setCurrentPage,
    rowsPerPage,
    totalPages,
    showModal,
    setShowModal,
    selectedCapacitation,
    handleRowClick,
    navegarCapacitacionFinalizada,
    totalCount
  } = useCapacitationList();

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentToShow, setCommentToShow] = useState<string | null>(null);


  // Columnas para DataTable
  const columns: TableColumn<Capacitation>[] = [
    {
      name: 'POE',
      selector: row => row.poe,
      sortable: true,
      cell: row => <div className="text-sm font-medium text-gray-900">{row.poe}</div>,
      wrap: true,
    },
    {
      name: 'TÍTULO',
      selector: row => row.titulo,
      sortable: true,
      cell: row => <div className="text-sm text-gray-700">{row.titulo}</div>,
      wrap: true,
    },
    {
      name: 'DURACIÓN (h)',
      selector: row => row.duracion,
      sortable: true,
      cell: row => <div className="text-sm text-gray-700">{row.duracion}</div>,
      wrap: true,
    },
    {
      name: 'COMENTARIO',
      selector: row => row.comentario,
      sortable: false,
      cell: row => (
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
      name: 'ID',
      selector: row => row.id,
      sortable: true,
      cell: row => <div className="text-sm text-gray-700">{row.id}</div>,

    },
    {
      name: 'FECHA INICIO',
      selector: row => row.fechaInicio,
      sortable: true,
      cell: row => <div className="text-sm text-gray-700">{row.fechaInicio}</div>,

    },
    {
      name: 'FECHA FINAL',
      selector: row => row.fechaFinal,
      sortable: true,
      cell: row => <div className="text-sm text-gray-700">{row.fechaFinal}</div>,

    },
    {
      name: 'ESTADO',
      selector: row => row.estado,
      sortable: true,
      cell: row => <div className="text-sm text-gray-700">{row.estado}</div>,
      wrap: true,
    },
    {
      name: 'SEGUIMIENTO',
      selector: row => row.seguimiento,
      sortable: true,
      cell: row => <div className="text-sm text-gray-700">{row.seguimiento}</div>,
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

  // Estilos personalizados para DataTable
  const customStyles = {
    table: {
      style: {
        minWidth: '100%',
        width: '100%',
      },
    },
    headRow: {
      style: {
        backgroundColor: '#F0FFF4',
        borderBottomWidth: '1px',
        borderBottomColor: '#E5E7EB',
      },
    },
    headCells: {
      style: {
        color: '#2AAC67',
        fontWeight: 'bold',
        textTransform: 'uppercase' as const,
        fontSize: '0.75rem',
        letterSpacing: '0.05em',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        whiteSpace: 'normal',
      },
    },
    cells: {
      style: {
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        whiteSpace: 'normal',
      },
    },
    rows: {
      style: {
        '&:not(:last-of-type)': {
          borderBottomWidth: '1px',
          borderBottomColor: '#E5E7EB',
        },
        '&:hover': {
          backgroundColor: '#F0FFF4',
          cursor: 'pointer',
        },
      },
    },
    pagination: {
      style: {
        borderTopWidth: '1px',
        borderTopColor: '#E5E7EB',
      },
    },
  };

  // Componente de paginación personalizado
  const CustomPagination = () => (
    <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between w-full">
        <div>
          <p className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{(currentPage - 1) * rowsPerPage + 1}</span> a <span className="font-medium">{Math.min(currentPage * rowsPerPage, totalCount)}</span> de{' '}
            <span className="font-medium">{totalCount}</span> resultados
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            >
              <span className="sr-only">Anterior</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx + 1}
                aria-current={currentPage === idx + 1 ? "page" : undefined}
                className={
                  currentPage === idx + 1
                    ? "bg-gray-300 border-gray-500 text-gray-900 font-bold shadow-md relative inline-flex items-center px-4 py-2 border text-sm rounded-md z-10"
                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-100 relative inline-flex items-center px-4 py-2 border text-sm rounded-md"
                }
                onClick={() => setCurrentPage(idx + 1)}
                style={currentPage === idx + 1 ? { pointerEvents: 'none' } : {}}
              >
                {idx + 1}
              </button>
            ))}
            <button
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <span className="sr-only">Siguiente</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-2 sm:p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#2AAC67] pb-2">
        Capacitaciones de la Empresa
      </h1>

      {/* Filtros */}
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

      {/* DataTable */}
      <div className="border border-gray-200 rounded-lg overflow-x-auto">
        <DataTable
          columns={columns}
          data={capacitations}
          customStyles={customStyles}
          onRowClicked={(row: Capacitation, e: React.MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.action-button')) {
              handleRowClick(row);
            }
          }}
          pagination
          paginationComponent={CustomPagination}
          noDataComponent={
            <div className="px-6 py-4 text-center text-sm text-gray-500">
              No se encontraron capacitaciones
            </div>
          }
          responsive
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
          <div className="bg-white rounded-2xl px-8 py-8 w-full max-w-3xl shadow-2xl relative border-2 border-[#2ecc71] overflow-y-auto max-h-[95vh]">
            {/* Botón cerrar */}
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
              {/* Información del Colaborador */}
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
              {/* Información del Profesor */}
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
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <div className="bg-white rounded-2xl px-6 py-6 w-full max-w-md shadow-2xl relative border-2 border-[#2ecc71]">
            <button
              onClick={() => setShowCommentModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <Close />
            </button>
            <h3 className="text-[#2ecc71] font-bold text-lg mb-4 text-center">Comentario completo</h3>
            <div className="text-gray-800 text-sm whitespace-pre-line break-words">
              {commentToShow}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
