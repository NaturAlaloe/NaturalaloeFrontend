import DataTable from "react-data-table-component";
import { Download, Search } from "@mui/icons-material";
import { useVersionControlProcedures } from "../../hooks/procedures/useVersionControlProcedures";
import type { PoeRow } from "../../hooks/procedures/useVersionControlProcedures";

export default function VersionControlProcedures() {
  const {
    poes,
    filterText,
    setFilterText,
    selectedRevision,
    setSelectedRevision,
  } = useVersionControlProcedures();

  const columns = [
    {
      name: 'POE',
      selector: (row: PoeRow) => row.codigo,
      sortable: true,
      cell: (row: PoeRow) => (
        <div className="text-sm font-medium text-gray-900">{row.codigo}</div>
      ),
      width: '120px',
    },
    {
      name: 'TÍTULO',
      selector: (row: PoeRow) => row.titulo,
      sortable: true,
      cell: (row: PoeRow) => (
        <div className="text-sm text-gray-700">{row.titulo}</div>
      ),
      grow: 2,
    },
    {
      name: 'DEPARTAMENTO',
      selector: (row: PoeRow) => row.departamento,
      sortable: true,
      cell: (row: PoeRow) => (
        <div className="text-sm text-gray-700">{row.departamento}</div>
      ),
    },
    {
      name: 'RESPONSABLE',
      selector: (row: PoeRow) => row.responsable,
      sortable: true,
      cell: (row: PoeRow) => (
        <div className="text-sm text-gray-700">{row.responsable}</div>
      ),
    },
    {
      name: 'REVISIÓN',
      cell: (row: PoeRow) => {
        const idx = selectedRevision[row.codigo] ?? row.versiones.length - 1;
        return (
          <select
            className="border border-gray-300 rounded px-2 py-1 text-sm text-[#2AAC67] bg-white"
            value={idx}
            onChange={e => setSelectedRevision({ ...selectedRevision, [row.codigo]: Number(e.target.value) })}
            style={{ minWidth: 80 }}
          >
            {row.versiones.map((ver, i) => (
              <option key={ver.revision} value={i}>{ver.revision}</option>
            ))}
          </select>
        );
      },
      width: '140px',
      wrap: true,
    },
    {
      name: 'FECHA VIGENCIA',
      cell: (row: PoeRow) => {
        const idx = selectedRevision[row.codigo] ?? row.versiones.length - 1;
        return (
          <div className="text-sm text-gray-700" style={{ whiteSpace: 'normal', wordBreak: 'break-word', minWidth: 0 }}>
            {row.versiones[idx].fechaVigencia}
          </div>
        );
      },
      width: '160px',
      wrap: true,
    },
    {
      name: 'DOCUMENTO',
      cell: (row: PoeRow) => {
        const idx = selectedRevision[row.codigo] ?? row.versiones.length - 1;
        return (
          <a
            href={row.versiones[idx].pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="action-button text-[#2AAC67] hover:text-[#1e8449] flex items-center gap-1"
            download
            title="Descargar PDF"
            onClick={e => e.stopPropagation()}
          >
            <Download fontSize="small" />
            <span className="underline">PDF</span>
          </a>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '120px',
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#F0FFF4',
        borderBottomWidth: '1px',
        borderBottomColor: '#E5E7EB',
      },
    },
    headCells: {
      style: {
        color: '#2AAC67',
        fontWeight: 'bold',
        textTransform: 'uppercase' as 'uppercase',
        fontSize: '0.75rem',
        letterSpacing: '0.05em',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
      },
    },
    cells: {
      style: {
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
      },
    },
    rows: {
      style: {
        '&:not(:last-of-type)': {
          borderBottomWidth: '1px',
          borderBottomColor: '#E5E7EB',
        },
        '&:hover': {
          backgroundColor: '#F0FFF4',
          cursor: 'pointer',
        },
      },
    },
    pagination: {
      style: {
        borderTopWidth: '1px',
        borderTopColor: '#E5E7EB',
      },
    },
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#2AAC67] pb-2">
        Control de versiones de POEs
      </h1>
      {/* Barra de búsqueda */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-[#2AAC67] sm:text-sm"
          placeholder="Buscar por código, título, departamento o responsable..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
      {/* DataTable */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <DataTable
          columns={columns}
          data={poes}
          customStyles={customStyles}
          noDataComponent={
            <div className="px-6 py-4 text-center text-sm text-gray-500">
              No se encontraron versiones de POEs
            </div>
          }
        />
      </div>
    </div>
  );
}
