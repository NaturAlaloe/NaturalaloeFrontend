import React from 'react';
import { useFacilitadoresList, type Facilitador } from '../../hooks/capacitations/useListFacilitators';
import { Edit, Delete, Search } from "@mui/icons-material";
import DataTable, { type TableColumn } from 'react-data-table-component';
export default function ListFacilitadores() {
  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    filtered,
    paginated,
    totalPages,
  } = useFacilitadoresList();

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("¿Desea eliminar este facilitador?")) {
      console.log(`Eliminar facilitador con id ${id}`);
    }
  };

  const columns: TableColumn<Facilitador>[] = [
    {
      name: "NOMBRE",
      selector: (row) => row.nombre,
      sortable: true,
    },
    {
      name: "APELLIDO",
      selector: (row) => row.apellido,
      sortable: true,
    },
    {
      name: "TIPO DE FACILITADOR",
      selector: (row) => row.tipo,
      sortable: true,
    },
    {
      name: "ACCIONES",
      cell: (row: Facilitador) => (
        <div className="flex items-center space-x-2">
          <button className="action-button text-[#2AAC67] hover:text-[#1e8449]" onClick={(e) => e.stopPropagation()}>
            <Edit fontSize="small" />
          </button>
          <button className="action-button text-[#F44336] hover:text-[#c62828]" onClick={(e) => handleDelete(row.id, e)}>
            <Delete fontSize="small" />
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
        backgroundColor: "#F0FFF4",
        borderBottomWidth: "1px",
        borderBottomColor: "#E5E7EB",
      },
    },
    headCells: {
      style: {
        color: "#2AAC67",
        fontWeight: "bold",
        textTransform: "uppercase" as const,
        fontSize: "0.75rem",
        letterSpacing: "0.05em",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
      },
    },
    cells: {
      style: {
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
      },
    },
    rows: {
      style: {
        "&:not(:last-of-type)": {
          borderBottomWidth: "1px",
          borderBottomColor: "#E5E7EB",
        },
        "&:hover": {
          backgroundColor: "#F0FFF4",
          cursor: "pointer",
        },
      },
    },
    pagination: {
      style: {
        borderTopWidth: "1px",
        borderTopColor: "#E5E7EB",
      },
    },
  };

  const CustomPagination = () => (
    <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between w-full">
        <div>
          <p className="text-sm text-gray-700">
            Mostrando{" "}
            <span className="font-medium">{(currentPage - 1) * rowsPerPage + 1}</span> a{" "}
            <span className="font-medium">{Math.min(currentPage * rowsPerPage, filtered.length)}</span> de{" "}
            <span className="font-medium">{filtered.length}</span> resultados
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <span className="sr-only">Anterior</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
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
                style={currentPage === idx + 1 ? { pointerEvents: "none" } : {}}
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
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#2AAC67] pb-2">
        Facilitadores
      </h1>

      {/* Búsqueda */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-[#2AAC67] sm:text-sm"
          placeholder="Buscar facilitadores por nombre, apellido o tipo..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <DataTable
          columns={columns}
          data={paginated}
          customStyles={customStyles}
          pagination
          paginationComponent={CustomPagination}
          noDataComponent={
            <div className="px-6 py-4 text-center text-sm text-gray-500">
              No se encontraron facilitadores
            </div>
          }
        />
      </div>
    </div>
  );
}