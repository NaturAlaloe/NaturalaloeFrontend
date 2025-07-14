import DataTable, { type TableColumn } from "react-data-table-component";
import React from "react";

// Utilidad para los números de página con elipsis
function getPageNumbers(current: number, total: number, max: number = 5) {
  if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | string)[] = [];
  const half = Math.floor(max / 2);

  let start = Math.max(1, current - half);
  let end = Math.min(total, current + half);

  if (start === 1) end = max;
  if (end === total) start = total - max + 1;

  if (start > 1) {
    pages.push(1, "...");
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < total) {
    pages.push("...", total);
  }

  return pages;
}

interface AppDataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  noDataComponent?: React.ReactNode;
  pagination?: boolean;
  customStyles?: any;
  dense?: boolean;
  highlightOnHover?: boolean;
  rowsPerPage?: number;
  currentPage?: number;
  onChangePage?: (page: number) => void;
  [key: string]: any;
}

export default function GlobalDataTable<T>({
  columns,
  data,
  noDataComponent = (
    <div className="px-6 py-4 text-center text-sm text-gray-500">
      No se encontraron resultados
    </div>
  ),
  pagination = true,
  customStyles = {
    headCells: {
      style: {
        background: "#F0FFF4",
        color: "#2AAC67",
        fontWeight: "bold",
        fontSize: "13px",
        textTransform: "uppercase",
      },
    },
  },
  dense = false,
  highlightOnHover = false,
  rowsPerPage = 10,
  currentPage,
  onChangePage,
  ...rest
}: AppDataTableProps<T>) {
  const [internalPage, setInternalPage] = React.useState(1);
  const page = currentPage ?? internalPage;
  const setPage = onChangePage ?? setInternalPage;

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = pagination
    ? data.slice((page - 1) * rowsPerPage, page * rowsPerPage)
    : data;

  // Nuevo estilo de paginación
  const CustomPagination = () => (
    <div className="flex justify-center items-center mt-6">
      <nav className="flex items-center space-x-1" aria-label="Pagination">
        {/* Botón Anterior */}
        <button
          className={`
            relative inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${page === 1 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md'
            }
          `}
          onClick={() => setPage(Math.max(page - 1, 1))}
          disabled={page === 1}
        >
          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Anterior
        </button>

        {/* Números de página */}
        <div className="flex items-center space-x-1">
          {getPageNumbers(page, totalPages, 5).map((p, idx) =>
            typeof p === "number" ? (
              <button
                key={p}
                aria-current={page === p ? "page" : undefined}
                className={`
                  relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 border
                  ${page === p
                    ? 'bg-gradient-to-r from-[#2AAC67] to-[#22965a] text-white border-[#2AAC67] shadow-md transform scale-105 cursor-default' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:transform hover:scale-105 hover:shadow-md'
                  }
                `}
                onClick={() => setPage(p)}
                disabled={page === p}
              >
                {p}
              </button>
            ) : (
              <span key={`ellipsis-${idx}`} className="px-2 py-2 text-gray-400 select-none text-sm">
                ...
              </span>
            )
          )}
        </div>

        {/* Botón Siguiente */}
        <button
          className={`
            relative inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${page === totalPages 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md'
            }
          `}
          onClick={() => setPage(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
        >
          Siguiente
          <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </nav>
    </div>
  );

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={paginatedData}
        noDataComponent={noDataComponent}
        customStyles={customStyles}
        pagination={false}
        dense={dense}
        highlightOnHover={highlightOnHover}
        {...rest}
      />
      {pagination && totalPages > 1 && <CustomPagination />}
    </div>
  );
}