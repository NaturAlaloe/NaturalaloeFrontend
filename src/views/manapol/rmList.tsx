import TableContainer from '../../components/TableContainer';
import GlobalDataTable from '../../components/globalComponents/GlobalDataTable';
import SearchBarTable from '../../components/globalComponents/SearchBarTable';
import FullScreenSpinner from '../../components/globalComponents/FullScreenSpinner';
import { Visibility, Edit, Delete, Restore } from '@mui/icons-material';
import useManapolList from '../../hooks/manapol/useManapolList';

interface Version {
  titulo: string;
  vigente: number;
  revision: number;
  responsable: string;
  id_documento: number;
  fecha_vigencia: string;
  ruta_documento: string;
}

interface RegistroManapol {
  codigo_rm: string;
  titulo: string;
  fecha_creacion: string;
  id_area: number;
  area: string;
  departamento: string;
  versiones: Version[];
}

const RmList = () => {
  const ui = useManapolList();

  const getSelectedVersion = (registro: RegistroManapol) => {
    const selectedVersionId = ui.selectedVersions[registro.codigo_rm];
    return registro.versiones?.find(v => v.id_documento === selectedVersionId) || 
           registro.versiones?.find(v => v.vigente === 1) || 
           registro.versiones?.[0];
  };

  const columns = [
    {
      name: "Código",
      selector: (row: RegistroManapol) => row.codigo_rm,
      sortable: true,
      width: "110px",
    },
    {
      name: "Título",
      selector: (row: RegistroManapol) => {
        const selectedVersion = getSelectedVersion(row);
        return selectedVersion?.titulo || row.titulo;
      },
      sortable: true,
      wrap: true,
      minWidth: "200px",
    },
    {
      name: "Departamento",
      selector: (row: RegistroManapol) => row.departamento,
      sortable: true,
      wrap: true,
      minWidth: "150px",
    },
    {
      name: "Responsable",
      selector: (row: RegistroManapol) => {
        const selectedVersion = getSelectedVersion(row);
        return selectedVersion?.responsable || "N/A";
      },
      sortable: true,
      wrap: true,
      minWidth: "150px",
    },
    {
      name: "Fecha Creación",
      selector: (row: RegistroManapol) => {
        const date = new Date(row.fecha_creacion);
        return date.toLocaleDateString();
      },
      sortable: true,
      wrap: true,
      minWidth: "130px",
    },
    {
      name: "Fecha Vigencia",
      selector: (row: RegistroManapol) => {
        const selectedVersion = getSelectedVersion(row);
        if (!selectedVersion?.fecha_vigencia) return "N/A";
        const date = new Date(selectedVersion.fecha_vigencia);
        return date.toLocaleDateString();
      },
      sortable: true,
      wrap: true,
      minWidth: "130px",
    },
    {
      name: "Revisión",
      cell: (row: RegistroManapol) => {
        const selectedVersionId = ui.selectedVersions[row.codigo_rm];
        const selectedVersion = getSelectedVersion(row);
        const isVigente = selectedVersion?.vigente === 1;
        const isObsolete = ui.registrosFilter === 'obsolete';

        return (
          <select
            className={`border border-gray-300 rounded px-2 py-1 text-sm bg-white ${
              isVigente ? 'text-green-600 font-medium' : 'text-[#2AAC67]'
            } ${isObsolete ? 'opacity-60' : ''}`}
            value={selectedVersionId || selectedVersion?.id_documento || ""}
            onChange={(e) => ui.handleVersionChange(row.codigo_rm, e.target.value)}
            style={{ minWidth: 80 }}
            disabled={isObsolete}
          >
            {row.versiones
              ?.sort((a, b) => a.revision - b.revision)
              ?.map((version) => (
              <option
                key={version.id_documento}
                value={version.id_documento}
                style={{
                  color: version.vigente === 1 ? '#16a34a' : '#2AAC67',
                  fontWeight: version.vigente === 1 ? 'bold' : 'normal'
                }}
              >
                {version.revision} {version.vigente === 1 ? '(Vigente)' : ''} 
              </option>
            ))}
          </select>
        );
      },
      width: "180px",
      sortable: true,
      wrap: true,
    },
    {
      name: "Acciones",
      cell: (row: RegistroManapol) => {
        const selectedVersion = getSelectedVersion(row);
        const isObsolete = ui.registrosFilter === 'obsolete';

        return (
          <div className="flex gap-2">
            <button
              className="text-[#2AAC67] hover:text-green-700"
              title="Ver PDF"
              onClick={() => ui.handleViewPdf(
                selectedVersion?.ruta_documento || "", 
                selectedVersion?.titulo || row.titulo
              )}
            >
              <Visibility fontSize="small" />
            </button>
            
            {!isObsolete && (
              <button
                className="text-[#2AAC67] hover:text-green-700"
                onClick={() => console.log('Editar:', row)}
                title="Editar"
              >
                <Edit fontSize="small" />
              </button>
            )}
            
            <button
              className={`${
                isObsolete 
                  ? "text-[#2AAC67] hover:text-green-700"
                  : "text-red-500 hover:text-red-700"
              }`}
              onClick={() => console.log(isObsolete ? 'Reactivar:' : 'Obsoleto:', row)}
              title={isObsolete ? "Reactivar" : "Marcar como obsoleto"}
            >
              {isObsolete ? <Restore fontSize="small" /> : <Delete fontSize="small" />}
            </button>
          </div>
        );
      },
      width: "110px",
    },
  ];

  return (
    <TableContainer title="Registros Manapol">
      {ui.loading && <FullScreenSpinner />}
      
      <div className="flex items-center justify-between mb-4 gap-4">
        <SearchBarTable
          value={ui.search}
          onChange={ui.setSearch}
          placeholder={`Buscar ${ui.registrosFilter === 'active' ? 'registros activos' : 'registros obsoletos'} por título, código o departamento...`}
          className="flex-1"
        />
        
        <div className="flex items-center gap-2">
          <select
            className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-transparent hover:border-gray-400"
            value={ui.registrosFilter}
            onChange={(e) => ui.handleFilterChange(e.target.value as 'active' | 'obsolete')}
          >
            <option value="active">Registros Activos</option>
            <option value="obsolete">Registros Obsoletos</option>
          </select>
        </div>
      </div>

      <GlobalDataTable
        columns={columns}
        data={ui.registros}
        rowsPerPage={10}
        progressPending={ui.loading}
        noDataComponent={
          <div className="p-4 text-center text-gray-500">
            {ui.registrosFilter === 'active' 
              ? "No se encontraron registros activos"
              : "No se encontraron registros obsoletos"
            }
          </div>
        }
      />
    </TableContainer>
  );
};

export default RmList;
