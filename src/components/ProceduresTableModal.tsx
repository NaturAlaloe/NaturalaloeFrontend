import { useState } from "react";
import DataTable, { type TableColumn } from "react-data-table-component";
import { Checkbox } from "@mui/material";

export type Procedimiento = { poe: string; titulo: string; codigo: string };

interface ProceduresTableModalProps {
  procedimientos: Procedimiento[];
  procedimientosSeleccionados: string[];
  onSeleccionChange: (seleccion: string[]) => void;
}

export default function ProceduresTableModal({
  procedimientos,
  procedimientosSeleccionados,
  onSeleccionChange,
}: ProceduresTableModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const totalPages = Math.ceil(procedimientos.length / rowsPerPage);

  const paginatedProcedimientos = procedimientos.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const columns: TableColumn<Procedimiento>[] = [
    {
      name: "",
      cell: (row) => (
        <Checkbox
          checked={procedimientosSeleccionados.includes(row.poe)}
          onChange={(e) => {
            if (e.target.checked) {
              onSeleccionChange([...procedimientosSeleccionados, row.poe]);
            } else {
              onSeleccionChange(
                procedimientosSeleccionados.filter((poe) => poe !== row.poe)
              );
            }
          }}
          style={{ color: "#2AAC67" }}
        />
      ),
      width: "60px",
      sortable: false,
    },
    {
      name: "Código POE",
      selector: (row) => row.codigo,
      sortable: true,
      width: "150px",
    },
    {
      name: "Título",
      selector: (row) => row.titulo,
      sortable: true,
      grow: 2,
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={paginatedProcedimientos}
        noDataComponent={
          <div className="px-6 py-4 text-center text-sm text-gray-500">
            No se encontraron procedimientos
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
        pagination={false}
        dense
        highlightOnHover
      />
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
    </>
  );
}