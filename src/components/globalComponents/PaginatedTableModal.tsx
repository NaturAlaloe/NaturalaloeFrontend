
import React, { useState, useMemo } from "react";
// Función auxiliar para mostrar los números de página con elipsis
function getPageNumbers(current: number, total: number, max: number) {
  if (total <= max) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const half = Math.floor(max / 2);
  let start = Math.max(1, current - half);
  let end = Math.min(total, current + half);
  if (start === 1) {
    end = max;
  } else if (end === total) {
    start = total - max + 1;
  }
  const pages: (number | string)[] = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  if (start > 1) {
    pages.unshift(1);
    if (start > 2) pages.splice(1, 0, '...');
  }
  if (end < total) {
    if (end < total - 1) pages.push('...');
    pages.push(total);
  }
  return pages;
}

interface PaginatedTableModalProps<T> {
  open: boolean;
  onClose: () => void;
  title?: string;
  columns: { name: string; selector: (row: T) => React.ReactNode }[];
  data: T[];
  rowsPerPage?: number;
  onAdd?: (selected: T[]) => void;
}

function PaginatedTableModal<T extends { id?: string | number }>({
  open,
  onClose,
  title,
  columns,
  data,
  rowsPerPage = 5,
  onAdd,
}: PaginatedTableModalProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Array<string | number>>([]);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [currentPage, data, rowsPerPage]);

  const toggleSelect = (id: string | number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const isSelected = (id: string | number) => selectedIds.includes(id);

  const handleAdd = () => {
    if (onAdd) {
      const selectedRows = data.filter((row) => row.id && selectedIds.includes(row.id));
      onAdd(selectedRows);
      setSelectedIds([]); // Limpiar selección después de añadir
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center md:justify-end bg-opacity-30">
      <div className="w-full md:w-[800px] bg-white mt-18 shadow-xl flex flex-col animate-slideInRight relative rounded-lg" style={{ maxWidth: "100vw", backdropFilter: "blur(4px)" }}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#2AAC67] hover:text-[#15803D] text-2xl font-bold focus:outline-none z-10"
          aria-label="Cerrar"
          type="button"
        >
          &times;
        </button>
        <div className="flex items-center justify-between p-4">
          <h3 className="font-semibold text-[#2AAC67] text-lg">{title}</h3>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#F0FFF4]">
                <tr>
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={paginated.length > 0 && paginated.every(row => row.id && isSelected(row.id))}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedIds(prev => [
                            ...prev,
                            ...paginated.filter(row => row.id && !prev.includes(row.id)).map(row => row.id as string | number)
                          ]);
                        } else {
                          setSelectedIds(prev => prev.filter(id => !paginated.some(row => row.id === id)));
                        }
                      }}
                    />
                  </th>
                  {columns.map((col) => (
                    <th key={col.name} className="px-6 py-3 text-left text-xs font-medium text-[#2AAC67] uppercase tracking-wider">
                      {col.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginated.map((row, idx) => (
                  <tr key={row.id ?? idx} className="hover:bg-[#F0FFF4] cursor-pointer">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={row.id ? isSelected(row.id) : false}
                        onChange={() => row.id && toggleSelect(row.id)}
                      />
                    </td>
                    {columns.map((col) => (
                      <td key={col.name} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {col.selector(row)}
                      </td>
                    ))}
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-sm text-gray-500">
                      No hay datos para mostrar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Paginación estilo GlobalDataTable */}
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
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
              >
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Anterior
              </button>

              {/* Números de página */}
              <div className="flex items-center space-x-1">
                {getPageNumbers(currentPage, totalPages, 5).map((p, idx) =>
                  typeof p === "number" ? (
                    <button
                      key={p}
                      aria-current={currentPage === p ? "page" : undefined}
                      className={`
                        relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 border
                        ${currentPage === p
                          ? 'bg-[#2AAC67] text-white border-[#2AAC67] shadow-md transform scale-105 cursor-default'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:transform hover:scale-105 hover:shadow-md'
                        }
                      `}
                      onClick={() => setCurrentPage(p)}
                      disabled={currentPage === p}
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
                  ${currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md'
                  }
                `}
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Siguiente
                <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div>


          {/* Botón Añadir */}
          {onAdd && (
            <div className="flex flex-col md:flex-row justify-end gap-2 mt-3">
              <button
                className="bg-[#2AAC67] text-white px-4 py-1 rounded hover:bg-[#24965c]"
                onClick={handleAdd}
                type="button"
                disabled={selectedIds.length === 0}
              >
                Añadir
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaginatedTableModal;
