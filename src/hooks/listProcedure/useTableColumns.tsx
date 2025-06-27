import { useMemo } from "react";
import { type TableColumn } from "react-data-table-component";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { type Procedure } from "../../services/procedures/procedureService";

interface UseTableColumnsProps {
  onViewDetails: (procedure: Procedure) => void;
  onEdit: (procedure: Procedure) => void;
  onDelete: (procedure: Procedure) => void;
}

export function useTableColumns({
  onViewDetails,
  onEdit,
  onDelete,
}: UseTableColumnsProps) {
  const columns: TableColumn<Procedure>[] = useMemo(
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
        cell: (row) => <div className="text-sm text-gray-700">{row.titulo}</div>,
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
        selector: (row) => row.responsable,
        sortable: true,
        cell: (row) => (
          <div className="text-sm text-gray-700">{row.responsable}</div>
        ),
      },
      {
        name: "REVISION",
        selector: (row) => row.revision,
        sortable: true,
      },
      {
        name: "FECHA VIGENCIA",
        selector: (row) => row.fecha_vigencia,
        sortable: true,
        cell: (row) => {
          const fecha = row.fecha_vigencia
            ? row.fecha_vigencia.split("T")[0].split("-").reverse().join("/")
            : "";
          return <div className="text-sm text-gray-700">{fecha}</div>;
        },
      },
      {
        name: "ACCIONES",
        cell: (row) => (
          <div className="flex items-center space-x-2">
            <button
              className="action-button text-green-600 hover:text-green-800 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(row);
              }}
              title="Ver detalles"
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
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
    ],
    [onViewDetails, onEdit, onDelete]
  );

  return columns;
}
