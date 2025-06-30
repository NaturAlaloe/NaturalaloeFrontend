import { useState } from "react";
import DataTable, { type TableColumn } from "react-data-table-component";
import { Checkbox } from "@mui/material";

export type Procedimiento = { 
  poe?: string; 
  titulo: string; 
  codigo: string;
  id_documento?: number;
  id_politica?: number;
  numero_politica?: string;
};

interface ProceduresTableModalProps {
  procedimientos: Procedimiento[];
  procedimientosSeleccionados: string[];
  onSeleccionChange: (seleccion: string[]) => void;
  tipo?: 'poe' | 'politica';
}

// Helper para generar el rango de páginas con puntos suspensivos
function getPageNumbers(current: number, total: number, max: number = 10) {
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

export default function ProceduresTableModal({
  procedimientos,
  procedimientosSeleccionados,
  onSeleccionChange,
  tipo = 'poe',
}: ProceduresTableModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const totalPages = Math.ceil(procedimientos.length / rowsPerPage);

  const paginatedProcedimientos = procedimientos.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Función para obtener el identificador único según el tipo
  const getItemId = (row: Procedimiento): string => {
    if (tipo === 'poe') {
      return row.poe || row.id_documento?.toString() || '';
    } else {
      return row.numero_politica || row.id_politica?.toString() || '';
    }
  };

  const columns: TableColumn<Procedimiento>[] = [
    {
      name: "",
      cell: (row) => {
        const itemId = getItemId(row);
        return (
          <Checkbox
            checked={procedimientosSeleccionados.includes(itemId)}
            onChange={(e) => {
              if (e.target.checked) {
                onSeleccionChange([...procedimientosSeleccionados, itemId]);
              } else {
                onSeleccionChange(
                  procedimientosSeleccionados.filter((id) => id !== itemId)
                );
              }
            }}
            style={{ color: "#2AAC67" }}
          />
        );
      },
      width: "60px",
      sortable: false,
    },
    {
      name: tipo === 'poe' ? "Código POE" : "Número Política",
      selector: (row) => tipo === 'poe' ? row.codigo : row.numero_politica || row.codigo,
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

  const noDataMessage = tipo === 'poe' 
    ? "No se encontraron procedimientos" 
    : "No se encontraron políticas";

  return (
    <>
      <DataTable
        columns={columns}
        data={paginatedProcedimientos}
        noDataComponent={
          <div className="px-6 py-4 text-center text-sm text-gray-500">
            {noDataMessage}
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
          {getPageNumbers(currentPage, totalPages, 5).map((page, idx) =>
            typeof page === "number" ? (
              <button
                key={page}
                aria-current={currentPage === page ? "page" : undefined}
                className={
                  currentPage === page
                    ? "bg-gray-300 border-gray-500 text-gray-900 font-bold shadow-md relative inline-flex items-center px-4 py-2 border text-sm rounded-md z-10"
                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-100 relative inline-flex items-center px-4 py-2 border text-sm rounded-md"
                }
                onClick={() => setCurrentPage(page)}
                style={currentPage === page ? { pointerEvents: 'none' } : {}}
              >
                {page}
              </button>
            ) : (
              <span key={`ellipsis-${idx}`} className="px-2 py-2 text-gray-400 select-none">...</span>
            )
          )}
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