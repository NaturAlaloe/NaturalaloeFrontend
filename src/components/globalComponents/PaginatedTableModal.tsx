import React, { useState, useMemo } from "react";

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
      <div className="w-full md:w-[600px] bg-white mt-18 shadow-xl flex flex-col animate-slideInRight relative rounded-lg" style={{ maxWidth: "100vw", backdropFilter: "blur(4px)" }}>
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
          {/* Paginación */}
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between w-full">
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{(currentPage - 1) * rowsPerPage + 1}</span> a <span className="font-medium">{Math.min(currentPage * rowsPerPage, data.length)}</span> de <span className="font-medium">{data.length}</span> resultados
              </p>
              <div>
                <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                  <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-2 py-2 border text-sm text-gray-500 bg-white hover:bg-gray-100 rounded-l-md">◀</button>
                  {[...Array(totalPages)].map((_, idx) => (
                    <button key={idx + 1} onClick={() => setCurrentPage(idx + 1)} className={`px-4 py-2 border text-sm ${currentPage === idx + 1 ? 'bg-gray-300 text-gray-900 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}>{idx + 1}</button>
                  ))}
                  <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-2 py-2 border text-sm text-gray-500 bg-white hover:bg-gray-100 rounded-r-md">▶</button>
                </nav>
              </div>
            </div>
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
