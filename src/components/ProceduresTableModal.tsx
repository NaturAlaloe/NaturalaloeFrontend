import DataTable, { type TableColumn } from "react-data-table-component";
import { Checkbox } from "@mui/material";

// tabla usada para mostrar los procedimientos en un modal dentro de
export type Procedimiento = { poe: string; titulo: string };

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
      selector: (row) => row.poe,
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
    <DataTable
      columns={columns}
      data={procedimientos}
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
      pagination
      dense
      highlightOnHover
    />
  );
}