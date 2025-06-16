import DataTable, { type TableColumn } from "react-data-table-component";
import React, { useState } from "react";

interface AppDataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  noDataComponent?: React.ReactNode;
  pagination?: boolean;
  customStyles?: any;
  dense?: boolean;
  highlightOnHover?: boolean;
  rowsPerPage?: number;
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
  ...rest
}: AppDataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = pagination
    ? data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    : data;

  const CustomPagination = () => (
    <div className="flex justify-center mt-4">
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
  );

  return (
    <>
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
    </>
  );
}