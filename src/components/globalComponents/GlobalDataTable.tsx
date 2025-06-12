import DataTable, { type TableColumn } from "react-data-table-component";
import React from "react";

interface AppDataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  noDataComponent?: React.ReactNode;
  pagination?: boolean;
  customStyles?: any;
  dense?: boolean;
  highlightOnHover?: boolean;
  [key: string]: any; 
}

export default function GlobalDataTable<T>({
  columns,
  data,
  noDataComponent = (
    <div className="px-6 py-4 text-center text-sm text-gray-500">
      No se encontraron resultados
    </div>
  ),
  pagination = true,
  customStyles = {
    headCells: {
      style: {
        background: "#F0FFF4",
        color: "#2AAC67",
        fontWeight: "bold",
        fontSize: "13px",
        textTransform: "uppercase",
      },
    },
  },
  dense = false,
  highlightOnHover = false,
  ...rest
}: AppDataTableProps<T>) {
  return (
    <DataTable
      columns={columns}
      data={data}
      noDataComponent={noDataComponent}
      customStyles={customStyles}
      pagination={pagination}
      dense={dense}
      highlightOnHover={highlightOnHover}
      {...rest}
    />
  );
}