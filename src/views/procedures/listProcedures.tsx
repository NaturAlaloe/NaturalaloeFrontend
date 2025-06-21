// src/views/procedures/listProcedures.tsx
import { useProceduresList, type Procedure } from "../../hooks/listProcedure/useProceduresList";
import type { TableColumn, SortOrder } from 'react-data-table-component';
import { Search, Check, Close, Info, Person, Badge, Apartment, Work, Edit, Delete } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import DataTable from 'react-data-table-component';
import api from '../../apiConfig/api';

export default function ListProcedures() {
  const {
    procedures,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    sortDirection,
    handleSort,
    departmentFilter,
    setDepartmentFilter,
    departments,
  } = useProceduresList();
  const { refetch } = useProceduresList();

  const [showModal, setShowModal] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const paginatedProcedures = procedures.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(procedures.length / rowsPerPage);

  const handleDelete = async (id_poe: number | null, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id_poe) {
      alert('ID de documento no válido.');
      return;
    }
    if (confirm('¿Está seguro que desea eliminar este procedimiento?')) {
      setDeletingId(id_poe);
      try {
        const response = await api.post('/procedureDelete', {
          id_documento: id_poe,
          vigencia: 0
        });
        if (response.data.success) {
          alert('Procedimiento eliminado correctamente');
          setSelectedProcedure(null);
          await refetch(); // Actualiza la lista sin recargar la página
        } else {
          alert(response.data.message || 'No se pudo eliminar el procedimiento');
        }
      } catch (error: any) {
        if (error.response?.data?.message) {
          alert(error.response.data.message);
        } else {
          alert('Error al eliminar el procedimiento');
        }
      } finally {
        setDeletingId(null);
      }
    }
  };

 const columns = [
  {
    name: 'ID POE',
    selector: (row: Procedure) => row.id_poe || 'N/A',
    sortable: true,
    cell: (row: Procedure) => (
      <div className="text-sm font-medium text-gray-900">
        {row.id_poe ? row.id_poe : 'No aplica'}
      </div>
    ),
  },
  {
    name: 'TÍTULO',
    selector: (row: Procedure) => row.titulo,
    sortable: true,
    cell: (row: Procedure) => (
      <div className="text-sm text-gray-700">{row.titulo}</div>
    ),
  },
  {
    name: 'DEPARTAMENTO',
    selector: (row: Procedure) => row.departamento,
    sortable: true,
    cell: (row: Procedure) => (
      <div className="text-sm text-gray-700">{row.departamento}</div>
    ),
  },
  {
    name: 'RESPONSABLE',
    selector: (row: Procedure) => row.responsable,
    sortable: true,
    cell: (row: Procedure) => (
      <div className="text-sm text-gray-700">{row.responsable}</div>
    ),
  },
  {
    name: 'REVISIÓN',
    selector: (row: Procedure) => row.revision,
    sortable: true,
    cell: (row: Procedure) => (
      <div className="text-sm text-gray-700">{row.revision}</div>
    ),
  },
  {
    name: 'FECHA VIGENCIA',
    selector: (row: Procedure) => row.fecha_vigencia,
    sortable: true,
    cell: (row: Procedure) => (
      <div className="text-sm text-gray-700">
        {new Date(row.fecha_vigencia).toLocaleDateString()}
      </div>
    ),
  },
  {
    name: 'ESTADO',
    cell: (row: Procedure) => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center', 
          justifyContent: 'flex-start', 
          width: '100%',
          height: '100%',
          paddingLeft: '1.0rem', 
        }}
      >
        <Box
          sx={{
            bgcolor: row.estado === 'Vigente' ? '#2AAC67' : '#F44336',
            borderRadius: '50%',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffff',
            border: row.estado === 'Vigente' ? '2px solid #2AAC67' : '2px solid #F44336',
          }}
        >
          {row.estado === 'Vigente' ? (
            <Check sx={{ fontSize: 16 }} />
          ) : (
            <Close sx={{ fontSize: 16 }} />
          )}
        </Box>
      </Box>
    ),
  },
  {
    name: 'ACCIONES',
    cell: (row: Procedure) => (
      <div className="flex items-center space-x-2">
        <Link
          to="/procedures"
          className="action-button text-[#2AAC67] hover:text-[#1e8449] transition-colors"
          onClick={(e) => e.stopPropagation()
          }
        >
          <Edit fontSize="small" />
        </Link>
        <button
          className="action-button text-[#F44336] hover:text-[#c62828] transition-colors"
          onClick={(e) => handleDelete(row.id_poe, e)}
          disabled={deletingId === row.id_poe}
        >
          {deletingId === row.id_poe ? (
            <span className="animate-spin h-5 w-5 border-2 border-t-2 border-[#F44336] rounded-full inline-block"></span>
          ) : (
            <Delete fontSize="small" />
          )}
        </button>
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
];

  const customStyles = {
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
      },
    },
    cells: {
      style: {
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
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

  const CustomPagination = () => (
    <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between w-full">
        <div>
          <p className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{(currentPage - 1) * rowsPerPage + 1}</span> a <span className="font-medium">{Math.min(currentPage * rowsPerPage, procedures.length)}</span> de{' '}
            <span className="font-medium">{procedures.length}</span> resultados
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#2AAC67] pb-2">
          Procedimientos de la Empresa
        </h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2AAC67]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#2AAC67] pb-2">
          Procedimientos de la Empresa
        </h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#2AAC67] pb-2">
        Procedimientos de la Empresa
      </h1>
      
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-[#2AAC67] sm:text-sm"
          placeholder="Buscar procedimientos por título o revisión..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
        <select
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-[#2AAC67]"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="">Todos los departamentos</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <DataTable
          columns={columns}
          data={paginatedProcedures}
          customStyles={customStyles}
          onRowClicked={(row: Procedure, e: React.MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.action-button')) {
              setSelectedProcedure(row);
              setShowModal(true);
            }
          }}
          pagination
          paginationComponent={CustomPagination}
          noDataComponent={
            <div className="px-6 py-4 text-center text-sm text-gray-500">
              No se encontraron procedimientos
            </div>
          }
          sortServer
          onSort={(
            column: TableColumn<Procedure>,
            sortDirection: SortOrder
          ) => {
            if (typeof column.selector === "function" && typeof column.name === "string") {
              const field = column.selector.name as keyof Procedure;
              handleSort(field); // Only pass the field
            }
          }}
          sortIcon={
            <span className="ml-1">
              {sortDirection === "asc" ? "↑" : "↓"}
            </span>
          }
        />
      </div>

      {showModal && selectedProcedure && (
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
              <h2 className="text-[#2ecc71] font-bold text-2xl text-center">Detalles de Procedimiento</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-[#2ecc71] font-bold text-lg mb-4 text-center md:text-left">Información del Procedimiento</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#2ecc71] mb-1">Código POE</label>
                    <div className="flex items-center border border-[#2ecc71] rounded-lg bg-[#f6fff6] px-3 py-2">
                      <Badge className="text-[#2ecc71] mr-2" />
                      <input
                        type="text"
                        value={selectedProcedure.id_poe ? selectedProcedure.id_poe : 'No aplica'}
                        readOnly
                        className="bg-transparent border-none p-0 text-gray-800 font-medium w-full focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#2ecc71] mb-1">Título</label>
                    <div className="flex items-center border border-[#2ecc71] rounded-lg bg-[#f6fff6] px-3 py-2">
                      <Info className="text-[#2ecc71] mr-2" />
                      <input
                        type="text"
                        value={selectedProcedure.titulo}
                        readOnly
                        className="bg-transparent border-none p-0 text-gray-800 font-medium w-full focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#2ecc71] mb-1">Versión</label>
                    <div className="flex items-center border border-[#2ecc71] rounded-lg bg-[#f6fff6] px-3 py-2">
                      <Work className="text-[#2ecc71] mr-2" />
                      <input
                        type="text"
                        value={selectedProcedure.revision}
                        readOnly
                        className="bg-transparent border-none p-0 text-gray-800 font-medium w-full focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[#2ecc71] font-bold text-lg mb-4 text-center md:text-left mt-8 md:mt-0">Información Adicional</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#2ecc71] mb-1">Departamento</label>
                    <div className="flex items-center border border-[#2ecc71] rounded-lg bg-[#f6fff6] px-3 py-2">
                      <Apartment className="text-[#2ecc71] mr-2" />
                      <input
                        type="text"
                        value={selectedProcedure.departamento}
                        readOnly
                        className="bg-transparent border-none p-0 text-gray-800 font-medium w-full focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#2ecc71] mb-1">Responsable</label>
                    <div className="flex items-center border border-[#2ecc71] rounded-lg bg-[#f6fff6] px-3 py-2">
                      <Person className="text-[#2ecc71] mr-2" />
                      <input
                        type="text"
                        value={selectedProcedure.responsable}
                        readOnly
                        className="bg-transparent border-none p-0 text-gray-800 font-medium w-full focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#2ecc71] mb-1">Estado</label>
                    <div className="flex items-center border border-[#2ecc71] rounded-lg bg-[#f6fff6] px-3 py-2">
                      <Info className="text-[#2ecc71] mr-2" />
                      <div className="flex items-center">
                        <Box
                          sx={{
                            bgcolor: selectedProcedure.estado === 'Vigente' ? '#2AAC67' : '#F44336',
                            borderRadius: '50%',
                            width: 24,
                            height: 24,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffff',
                            border: selectedProcedure.estado === 'Vigente' ? '2px solid #2AAC67' : '2px solid #F44336',
                            mr: 1
                          }}
                        >
                          {selectedProcedure.estado === 'Vigente' ? (
                            <Check sx={{ fontSize: 16 }} />
                          ) : (
                            <Close sx={{ fontSize: 16 }} />
                          )}
                        </Box>
                        <span className="text-gray-800 font-medium">
                          {selectedProcedure.estado}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}