import { useMemo, useCallback } from "react";
import { type TableColumn } from "react-data-table-component";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { type ProcedureRow } from "../proceduresVersionControll/useProceduresVersions";

interface UseVersionedTableColumnsProps {
  onEdit: (procedure: any) => void;
  onDelete: (procedure: any) => void;
  onViewPdf: (procedure: any) => void;
  selectedRevision: Record<string, number>;
  onVersionChange: (codigo: string, versionIndex: number) => void;
  getSelectedVersionData: (row: any, field: string) => string | null;
}

export function useVersionedTableColumns({
  onEdit,
  onDelete,
  onViewPdf,
  selectedRevision,
  onVersionChange,
  getSelectedVersionData,
}: UseVersionedTableColumnsProps) {
  // Renderer para la celda de revisión con select
  const renderRevisionCell = useCallback(
    (row: ProcedureRow) => {
      if (row.versiones && Array.isArray(row.versiones)) {
        const idx = selectedRevision[row.codigo] ?? row.versiones.length - 1;
        return (
          <select
            className="border border-gray-300 rounded px-2 py-1 text-sm text-[#2AAC67] bg-white"
            value={idx}
            onChange={(e) =>
              onVersionChange(row.codigo, Number(e.target.value))
            }
            style={{ minWidth: 80 }}
          >
            {row.versiones.map((ver, i) => (
              <option key={ver.codigo || i} value={i}>
                {ver.version}
              </option>
            ))}
          </select>
        );
      }
      return <div className="text-sm text-gray-700">1</div>;
    },
    [selectedRevision, onVersionChange]
  );

  // Renderer para responsable con datos de versión
  const renderResponsableCell = useCallback(
    (row: ProcedureRow) => {
      const versionData = getSelectedVersionData(row, "responsable");
      if (versionData !== null) {
        return <div className="text-sm text-gray-700">{versionData}</div>;
      }
      return <div className="text-sm text-gray-700">-</div>;
    },
    [getSelectedVersionData]
  );

  // Renderer para fecha vigencia con datos de versión
  const renderFechaVigenciaCell = useCallback(
    (row: ProcedureRow) => {
      const versionData = getSelectedVersionData(row, "fecha_vigencia");
      if (versionData !== null) {
        return <div className="text-sm text-gray-700">{versionData}</div>;
      }
      return <div className="text-sm text-gray-700">-</div>;
    },
    [getSelectedVersionData]
  );

  // Renderer para acciones
  const renderActionsCell = useCallback(
    (row: ProcedureRow) => (
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
        <button
          className="action-button text-red-600 hover:text-red-800 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(row);
          }}
          title="Eliminar"
        >
          <Delete fontSize="small" />
        </button>
      </div>
    ),
    [onEdit, onDelete, onViewPdf]
  );

  const columns: TableColumn<ProcedureRow>[] = useMemo(
    () => [
      {
        name: "CÓDIGO",
        selector: (row) => row.codigo || "No aplica",
        sortable: true,
        cell: (row) => (
          <div className="text-sm font-medium text-gray-900">
            {row.codigo || "No aplica"}
          </div>
        ),
      },
      {
        name: "TÍTULO",
        selector: (row) => row.titulo,
        sortable: true,
        cell: (row) => (
          <div className="text-sm text-gray-700">{row.titulo}</div>
        ),
      },
      {
        name: "DEPARTAMENTO",
        selector: (row) => row.departamento,
        sortable: true,
        cell: (row) => (
          <div className="text-sm text-gray-700">{row.departamento}</div>
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
        name: "REVISION",
        selector: (row) => {
          const idx = selectedRevision[row.codigo] ?? row.versiones.length - 1;
          return row.versiones[idx]?.version || 1;
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
      renderResponsableCell,
      renderFechaVigenciaCell,
      renderActionsCell,
    ]
  );

  return columns;
}
