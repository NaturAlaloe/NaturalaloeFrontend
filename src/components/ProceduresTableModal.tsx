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
  // MANAPOL fields
  tipo?: string;
  departamento?: string;
  responsable?: string;
  estado?: string;
};

interface ProceduresTableModalProps {
  procedimientos: Procedimiento[];
  procedimientosSeleccionados: string[];
  onSeleccionChange: (seleccion: string[]) => void;
  tipo?: 'poe' | 'politica' | 'manapol';
  isSaving?: boolean; // <-- Añade esta prop opcional
}

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
  const rowsPerPage = 4;
  const totalPages = Math.ceil(procedimientos.length / rowsPerPage);

  const paginatedProcedimientos = procedimientos.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const getItemId = (row: Procedimiento): string => {
    // Primary: use id_documento if available
    if (row.id_documento) {
      return row.id_documento.toString();
    }
    
    // Fallback: use id_politica for politics
    if (row.id_politica) {
      return `pol_${row.id_politica}`;
    }
    
    // Last resort: use codigo as unique identifier
    return row.codigo || '';
  };

  const columns: TableColumn<Procedimiento>[] = [
    {
      name: "",
      cell: (row) => {
        const itemId = getItemId(row);
        const isChecked = procedimientosSeleccionados.includes(itemId);
        
        return (
          <Checkbox
            checked={isChecked}
            onChange={(e) => {
              if (e.target.checked) {
                const nuevaSeleccion = [...procedimientosSeleccionados, itemId];
                onSeleccionChange(nuevaSeleccion);
              } else {
                const nuevaSeleccion = procedimientosSeleccionados.filter((id) => id !== itemId);
                onSeleccionChange(nuevaSeleccion);
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
      name: tipo === 'poe' ? "Código POE" : tipo === 'politica' ? "Código" : "Código MANAPOL",
      selector: (row) => row.codigo || '',
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
    : tipo === 'politica' 
      ? "No se encontraron políticas"
      : "No se encontraron registros MANAPOL";

  return (
    <div className="w-full">
      {/* Container principal con borde y border radius SIN overflow-hidden */}
      <div className="border border-gray-300 rounded-lg shadow-sm bg-white">
        <DataTable
          columns={columns}
          data={paginatedProcedimientos}
          keyField="id_documento"
          noDataComponent={
            <div className="px-6 py-8 text-center text-sm text-gray-500">
              <div className="flex flex-col items-center">
                <svg 
                  className="w-12 h-12 text-gray-300 mb-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="font-medium">{noDataMessage}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {tipo === 'poe' ? 'Prueba ajustando los filtros de búsqueda' : 
                   tipo === 'politica' ? 'Revisa los criterios de búsqueda' :
                   'Verifica los filtros de búsqueda para registros MANAPOL'}
                </p>
              </div>
            </div>
          }
          customStyles={{
            table: {
              style: {
                backgroundColor: 'transparent',
              },
            },
            headRow: {
              style: {
                background: "linear-gradient(135deg, #F0FFF4 0%, #E8F5E8 100%)",
                borderBottom: "2px solid #2AAC67",
                minHeight: "48px",
              },
            },
            headCells: {
              style: {
                background: "transparent",
                color: "#2AAC67",
                fontWeight: "600",
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                paddingLeft: "16px",
                paddingRight: "16px",
              },
            },
            rows: {
              style: {
                minHeight: "52px",
                fontSize: "14px",
                borderBottom: "1px solid #f1f5f9",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "#f8fffe",
                },
                "&:last-child": {
                  borderBottom: "none",
                },
              },
            },
            cells: {
              style: {
                paddingLeft: "16px",
                paddingRight: "16px",
              },
            },
          }}
          pagination={false}
          dense={false}
          highlightOnHover
        />
      </div>

      {/* Paginación mejorada */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6">
          <nav className="flex items-center space-x-1" aria-label="Pagination">
            {/* Botón Anterior */}
            <button
              className={`
                relative inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${currentPage === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md'
                }
              `}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>

            {/* Números de página */}
            <div className="flex items-center space-x-1">
              {getPageNumbers(currentPage, totalPages, 5).map((page, idx) =>
                typeof page === "number" ? (
                  <button
                    key={page}
                    aria-current={currentPage === page ? "page" : undefined}
                    className={`
                      relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 border
                      ${currentPage === page
                        ? 'bg-gradient-to-r from-[#2AAC67] to-[#22965a] text-white border-[#2AAC67] shadow-md transform scale-105 cursor-default' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:transform hover:scale-105 hover:shadow-md'
                      }
                    `}
                    onClick={() => setCurrentPage(page)}
                    disabled={currentPage === page}
                  >
                    {page}
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
                ${currentPage === totalPages 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md'
                }
              `}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Siguiente
              <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}