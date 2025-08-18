import { useState } from "react";
import DataTable, { type TableColumn } from "react-data-table-component";
import { Checkbox } from "@mui/material";

export type Procedimiento = { 
  poe?: string; 
  titulo: string; 
  codigo: string;
  descripcion?: string;
  nombre?: string;
  id_documento?: number;
  id_politica?: number;
  numero_politica?: string;
  codigo_rm?: string; // Agregar este campo para manapol
};

interface ProceduresTableModalProps {
  procedimientos: Procedimiento[];
  procedimientosSeleccionados: string[];
  onSeleccionChange: (seleccion: string[]) => void;
  tipo?: 'poe' | 'politica' | 'manapol';
  isSaving?: boolean;
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
    return row.id_documento?.toString() || '';
  };

  const getTitulo = (row: Procedimiento): string => {
    switch (tipo) {
      case 'manapol':
        return row.descripcion || row.titulo || row.nombre || '';
      case 'politica':
        return row.titulo || row.nombre || row.descripcion || '';
      default:
        return row.titulo || row.descripcion || '';
    }
  };

  const getColor = () => {
    switch (tipo) {
      case 'manapol':
        return '#2AAC67';
      case 'politica':
        return '#2AAC67';
      default:
        return '#2AAC67';
    }
  };

  const handleCheckboxChange = (itemId: string, isChecked: boolean) => {
    
    let nuevaSeleccion: string[];
    
    if (isChecked) {
      // Agregar el item si no está en la selección
      if (!procedimientosSeleccionados.includes(itemId)) {
        nuevaSeleccion = [...procedimientosSeleccionados, itemId];
      } else {
        nuevaSeleccion = procedimientosSeleccionados;
      }
    } else {
      // Remover el item de la selección
      nuevaSeleccion = procedimientosSeleccionados.filter(id => id !== itemId);
    }
    
    onSeleccionChange(nuevaSeleccion);
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
            onChange={(e) => handleCheckboxChange(itemId, e.target.checked)}
            sx={{ 
              color: getColor(),
              '&.Mui-checked': { color: getColor() }
            }}
          />
        );
      },
      width: "60px",
      sortable: false,
    },
    {
      name: (() => {
        switch (tipo) {
          case 'manapol':
            return "Código RM";
          case 'politica':
            return "Código";
          default:
            return "Código POE";
        }
      })(),
      selector: (row) => {
        // Para manapol, usar codigo_rm si está disponible, sino codigo
        if (tipo === 'manapol') {
          return row.codigo_rm || row.codigo || '';
        }
        return row.codigo || '';
      },
      cell: (row) => {
        // Renderizado custom para mejor control
        let codigo = '';
        if (tipo === 'manapol') {
          codigo = row.codigo_rm || row.codigo || '';
        } else {
          codigo = row.codigo || '';
        }
        return <span>{codigo}</span>;
      },
      sortable: true,
      width: "150px",
    },
    {
      name: (() => {
        switch (tipo) {
          case 'manapol':
            return "Descripción";
          case 'politica':
            return "Título";
          default:
            return "Título";
        }
      })(),
      selector: (row) => getTitulo(row),
      cell: (row) => {
        const titulo = getTitulo(row);
        return <span>{titulo}</span>;
      },
      sortable: true,
      grow: 2,
    },
  ];

  const noDataMessage = (() => {
    switch (tipo) {
      case 'manapol':
        return "No se encontraron registros de manapol";
      case 'politica':
        return "No se encontraron políticas";
      default:
        return "No se encontraron procedimientos";
    }
  })();

  const searchHint = (() => {
    switch (tipo) {
      case 'manapol':
        return "Prueba ajustando los filtros de búsqueda de manapol";
      case 'politica':
        return "Revisa los criterios de búsqueda de políticas";
      default:
        return "Prueba ajustando los filtros de búsqueda";
    }
  })();

  const gradientColor = tipo === 'manapol' 
    ? "linear-gradient(135deg, #FFF5F0 0%, #FFEDE4 100%)"
    : "linear-gradient(135deg, #F0FFF4 0%, #E8F5E8 100%)";

  const borderColor = getColor();

  return (
    <div className="w-full">
      <div className="border border-gray-300 rounded-lg shadow-sm bg-white">
        <DataTable
          columns={columns}
          data={paginatedProcedimientos}
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
                  {searchHint}
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
                background: gradientColor,
                borderBottom: `2px solid ${borderColor}`,
                minHeight: "48px",
              },
            },
            headCells: {
              style: {
                background: "transparent",
                color: borderColor,
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
                  backgroundColor: tipo === 'manapol' ? "#fffaf8" : "#f8fffe",
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

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6">
          <nav className="flex items-center space-x-1" aria-label="Pagination">
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

            <div className="flex items-center space-x-1">
              {getPageNumbers(currentPage, totalPages, 5).map((page, idx) =>
                typeof page === "number" ? (
                  <button
                    key={page}
                    aria-current={currentPage === page ? "page" : undefined}
                    className={`
                      relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 border
                      ${currentPage === page
                        ? `bg-gradient-to-r ${tipo === 'manapol' ? 'from-[#2AAC67] to-[#2AAC67]' : 'from-[#2AAC67] to-[#2AAC67]'} text-white border-[${borderColor}] shadow-md transform scale-105 cursor-default` 
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