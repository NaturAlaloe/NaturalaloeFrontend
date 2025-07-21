import { useMemo, useCallback } from "react";
import { type TableColumn } from "react-data-table-component";
import { Edit, Visibility, Delete, Restore } from "@mui/icons-material";
import { type ProcedureRow } from "../proceduresVersionControll/useProceduresVersions";

interface UseVersionedTableColumnsProps {
  onEdit: (procedure: any) => void;
  onViewPdf: (procedure: any) => void;
  selectedRevision: Record<string, number>;
  onVersionChange: (codigo: string, versionIndex: number) => void;
  getSelectedVersionData: (row: any, field: string) => string | null;
  handleAskObsolete: (id_documento: number) => void;
  procedureFilter: 'active' | 'obsolete'; // Nuevo prop
}

export function useVersionedTableColumns({
  onEdit,
  onViewPdf,
  selectedRevision,
  onVersionChange,
  getSelectedVersionData,
  handleAskObsolete,
  procedureFilter,
}: UseVersionedTableColumnsProps) {
  // Renderer para la celda de revisión con select
  const renderRevisionCell = useCallback(
    (row: ProcedureRow) => {
      if (row.versiones && Array.isArray(row.versiones)) {
        const idx = selectedRevision[row.codigo_poe] ?? row.versiones.length - 1;
        const selectedVersion = row.versiones[idx];
        const isVigente = selectedVersion?.vigente === 1;
        
        return (
          <select
            className={`border border-gray-300 rounded px-2 py-1 text-sm bg-white ${
              isVigente ? 'text-green-600 font-medium' : 'text-[#2AAC67]'
            } ${procedureFilter === 'obsolete' ? 'opacity-60' : ''}`}
            value={idx}
            onChange={(e) =>
              onVersionChange(row.codigo_poe, Number(e.target.value))
            }
            style={{ minWidth: 80 }}
            disabled={procedureFilter === 'obsolete'}
          >
            {row.versiones.map((ver, i) => (
              <option 
                key={ver.id_documento} 
                value={i}
                style={{ 
                  color: ver.vigente === 1 ? '#16a34a' : '#2AAC67',
                  fontWeight: ver.vigente === 1 ? 'bold' : 'normal'
                }}
              >
                {ver.revision} {ver.vigente === 1 ? '(Vigente)' : ''}
              </option>
            ))}
          </select>
        );
      }
      return <div className="text-sm text-gray-700">1</div>;
    },
    [selectedRevision, onVersionChange, procedureFilter]
  );

  // Renderer para título con datos de versión
  const renderTituloCell = useCallback(
    (row: ProcedureRow) => {
      const versionData = getSelectedVersionData(row, "titulo");
      if (versionData !== null) {
        return (
          <div className={`text-sm ${procedureFilter === 'obsolete' ? 'text-gray-500' : 'text-gray-700'}`}>
            {versionData}
          </div>
        );
      }
      return (
        <div className={`text-sm ${procedureFilter === 'obsolete' ? 'text-gray-500' : 'text-gray-700'}`}>
          {row.titulo}
          {procedureFilter === 'obsolete' && (
            <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
              OBSOLETO
            </span>
          )}
        </div>
      );
    },
    [getSelectedVersionData, procedureFilter]
  );

  // Renderer para responsable con datos de versión
  const renderResponsableCell = useCallback(
    (row: ProcedureRow) => {
      const versionData = getSelectedVersionData(row, "responsable");
      if (versionData !== null) {
        return <div className={`text-sm ${procedureFilter === 'obsolete' ? 'text-gray-500' : 'text-gray-700'}`}>{versionData}</div>;
      }
      return <div className={`text-sm ${procedureFilter === 'obsolete' ? 'text-gray-500' : 'text-gray-700'}`}>-</div>;
    },
    [getSelectedVersionData, procedureFilter]
  );

  // Renderer para fecha vigencia con datos de versión
  const renderFechaVigenciaCell = useCallback(
    (row: ProcedureRow) => {
      const versionData = getSelectedVersionData(row, "fecha_vigencia");
      if (versionData !== null) {
        return <div className={`text-sm ${procedureFilter === 'obsolete' ? 'text-gray-500' : 'text-gray-700'}`}>{versionData}</div>;
      }
      return <div className={`text-sm ${procedureFilter === 'obsolete' ? 'text-gray-500' : 'text-gray-700'}`}>-</div>;
    },
    [getSelectedVersionData, procedureFilter]
  );

  // Renderer para acciones
  const renderActionsCell = useCallback(
    (row: ProcedureRow) => {
      const isObsolete = procedureFilter === 'obsolete';
      
      return (
        <div className="flex items-center space-x-2">
          <button
            className="action-button text-green-600 hover:text-green-800 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onViewPdf(row);
            }}
            title="Ver PDF"
          >
            <Visibility fontSize="small" />
          </button>
          
          {!isObsolete && (
            <button
              className="action-button text-green-600 hover:text-green-800 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(row);
              }}
              title="Editar"
            >
              <Edit fontSize="small" />
            </button>
          )}
          
          <button
            className={`action-button ${
              isObsolete 
                ? "text-[#2AAC67] hover:text-green-700" 
                : "text-red-500 hover:text-red-700"
            } transition-colors`}
            onClick={(e) => {
              e.stopPropagation();
              handleAskObsolete(
                row.versiones[
                  selectedRevision[row.codigo_poe] ?? row.versiones.length - 1
                ].id_documento
              );
            }}
            title={isObsolete ? "Reactivar" : "Marcar como obsoleto"}
          >
            {isObsolete ? <Restore fontSize="small" /> : <Delete fontSize="small" />}
          </button>
        </div>
      );
    },
    [onEdit, onViewPdf, handleAskObsolete, selectedRevision, procedureFilter]
  );

  const columns: TableColumn<ProcedureRow>[] = useMemo(
    () => [
      {
        name: "CÓDIGO POE",
        selector: (row) => row.codigo_poe || "No aplica",
        sortable: true,
        cell: (row) => (
          <div className={`text-sm font-medium ${procedureFilter === 'obsolete' ? 'text-gray-500' : 'text-gray-900'}`}>
            {row.codigo_poe || "No aplica"}
          </div>
        ),
      },
      {
        name: "TÍTULO",
        selector: (row) => {
          const versionData = getSelectedVersionData(row, "titulo");
          return versionData || row.titulo;
        },
        sortable: true,
        cell: renderTituloCell,
      },
      {
        name: "DEPARTAMENTO",
        selector: (row) => row.departamento,
        sortable: true,
        cell: (row) => (
          <div className={`text-sm ${procedureFilter === 'obsolete' ? 'text-gray-500' : 'text-gray-700'}`}>{row.departamento}</div>
        ),
      },
      {
        name: "CATEGORÍA",
        selector: (row) => row.categoria,
        sortable: true,
        cell: (row) => (
          <div className={`text-sm ${procedureFilter === 'obsolete' ? 'text-gray-500' : 'text-gray-700'}`}>{row.categoria}</div>
        ),
      },
      {
        name: "RESPONSABLE",
        selector: (row) => {
          const versionData = getSelectedVersionData(row, "responsable");
          return versionData || "-";
        },
        sortable: true,
        cell: renderResponsableCell,
      },
      {
        name: "REVISIÓN",
        selector: (row) => {
          const idx = selectedRevision[row.codigo_poe] ?? row.versiones.length - 1;
          return row.versiones[idx]?.revision || 1;
        },
        sortable: true,
        cell: renderRevisionCell,
      },
      {
        name: "FECHA VIGENCIA",
        selector: (row) => {
          const versionData = getSelectedVersionData(row, "fecha_vigencia");
          return versionData || "-";
        },
        sortable: true,
        cell: renderFechaVigenciaCell,
      },
      {
        name: "ACCIONES",
        cell: renderActionsCell,
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
    ],
    [
      selectedRevision,
      getSelectedVersionData,
      renderRevisionCell,
      renderTituloCell,
      renderResponsableCell,
      renderFechaVigenciaCell,
      renderActionsCell,
      procedureFilter,
    ]
  );

  return columns;
}