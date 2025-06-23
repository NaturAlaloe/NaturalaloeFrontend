import React, { useState } from "react";
import { Visibility } from "@mui/icons-material";
import { useProceduresVersions, type ProcedureRow } from "../../hooks/proceduresVersionControll/useProceduresVersions";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import SearchBar from "../../components/globalComponents/SearchBarTable";

export default function VersionControlProcedures() {
  const { procedures, loading } = useProceduresVersions();
  // Filtro local (puedes mejorarlo con useMemo si la tabla es grande)
  const [filterText, setFilterText] = React.useState("");
  const [selectedRevision, setSelectedRevision] = React.useState<Record<string, number>>({});

  const filteredProcedures = procedures.filter((row) => {
    const text = filterText.toLowerCase();
    return (
      row.codigo.toLowerCase().includes(text) ||
      row.titulo.toLowerCase().includes(text) ||
      row.departamento.toLowerCase().includes(text) ||
      row.versiones.some((v) => v.responsable.toLowerCase().includes(text))
    );
  });

  const columns = [
    {
      name: "POE",
      selector: (row: ProcedureRow) => row.codigo,
      sortable: true,
      cell: (row: ProcedureRow) => (
        <div className="text-sm font-medium text-gray-900">{row.codigo}</div>
      ),
      width: "120px",
    },
    {
      name: "TÍTULO",
      selector: (row: ProcedureRow) => row.titulo,
      sortable: true,
      cell: (row: ProcedureRow) => (
        <div className="text-sm text-gray-700">{row.titulo}</div>
      ),
      grow: 2,
    },
    {
      name: "DEPARTAMENTO",
      selector: (row: ProcedureRow) => row.departamento,
      sortable: true,
      cell: (row: ProcedureRow) => (
        <div className="text-sm text-gray-700">{row.departamento}</div>
      ),
    },
    {
      name: "RESPONSABLE",
      selector: (row: ProcedureRow) => row.versiones[selectedRevision[row.codigo] ?? row.versiones.length - 1]?.responsable || "",
      sortable: true,
      cell: (row: ProcedureRow) => (
        <div className="text-sm text-gray-700">{row.versiones[selectedRevision[row.codigo] ?? row.versiones.length - 1]?.responsable || ""}</div>
      ),
    },
    {
      name: "REVISIÓN",
      cell: (row: ProcedureRow) => {
        const idx = selectedRevision[row.codigo] ?? row.versiones.length - 1;
        return (
          <select
            className="border border-gray-300 rounded px-2 py-1 text-sm text-[#2AAC67] bg-white"
            value={idx}
            onChange={e => setSelectedRevision({ ...selectedRevision, [row.codigo]: Number(e.target.value) })}
            style={{ minWidth: 80 }}
          >
            {row.versiones.map((ver, i) => (
              <option key={ver.codigo} value={i}>{ver.version}</option>
            ))}
          </select>
        );
      },
      width: "140px",
      wrap: true,
    },
    {
      name: "FECHA VIGENCIA",
      cell: (row: ProcedureRow) => {
        const idx = selectedRevision[row.codigo] ?? row.versiones.length - 1;
        return (
          <div className="text-sm text-gray-700" style={{ whiteSpace: "normal", wordBreak: "break-word", minWidth: 0 }}>
            {row.versiones[idx]?.fecha_vigencia || ""}
          </div>
        );
      },
      width: "160px",
      wrap: true,
    },
    {
      name: "DOCUMENTO",
      cell: (row: ProcedureRow) => {
        const idx = selectedRevision[row.codigo] ?? row.versiones.length - 1;
        return (
          <a
            href={row.versiones[idx]?.pdf}
            target="_blank"
            rel="noopener noreferrer"
            className="action-button text-[#2AAC67] hover:text-[#1e8449] flex items-center gap-1"
            title="Visualizar PDF"
            onClick={e => e.stopPropagation()}
          >
            <Visibility fontSize="small" />
            <span className="underline">Ver</span>
          </a>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "120px",
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#2AAC67] pb-2">
        Control de versiones de POEs
      </h1>
      {/* Barra de búsqueda */}
      <div className="relative mb-6">
        <SearchBar
          value={filterText}
          onChange={setFilterText}
          placeholder="Buscar por código, título, departamento o responsable..."
        />
      </div>
      {/* DataTable */}
      <GlobalDataTable
        columns={columns}
        data={filteredProcedures}
        pagination={true}
        progressPending={loading}
        noDataComponent={
          <div className="px-6 py-4 text-center text-sm text-gray-500">
            No se encontraron versiones de POEs
          </div>
        }
      />
    </div>
  );
}
