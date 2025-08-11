import TableContainer from '../../components/TableContainer';
import GlobalDataTable from '../../components/globalComponents/GlobalDataTable';
import SearchBarTable from '../../components/globalComponents/SearchBarTable';
import FullScreenSpinner from '../../components/globalComponents/FullScreenSpinner';
import GlobalModal from '../../components/globalComponents/GlobalModal';
import FormContainer from '../../components/formComponents/FormContainer';
import InputField from '../../components/formComponents/InputField';
import SelectAutocomplete from '../../components/formComponents/SelectAutocomplete';
import StyledCheckbox from '../../components/formComponents/StyledCheckbox';
import PdfInput from '../../components/formComponents/PdfInput';
import SubmitButton from '../../components/formComponents/SubmitButton';
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
        // Extraer solo la parte de la fecha sin la hora y zona horaria
        const dateStr = row.fecha_creacion.split('T')[0]; // "2025-08-10"
        const [year, month, day] = dateStr.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
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
        
        // La fecha de vigencia viene como "2026-08-10", sin zona horaria
        const [year, month, day] = selectedVersion.fecha_vigencia.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
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
                onClick={() => ui.handleOpenEdit(row)}
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

      {/* Modal de edición */}
      <GlobalModal
        open={ui.editHook.editModalOpen}
        onClose={() => !ui.editHook.saving && ui.editHook.closeEdit()}
        title=""
        maxWidth="lg"
        backgroundColor="#DDF6E8"
      >
        {ui.editHook.editData && (
          <FormContainer
            title={
              ui.editHook.editData.es_nueva_version
                ? "Crear Nueva Versión"
                : "Editar Registro Manapol"
            }
            onSubmit={ui.editHook.handleSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ui.editHook.editData.es_nueva_version && (
                <div className="md:col-span-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Creando Nueva Versión</h4>
                  <p className="text-gray-700 text-sm">
                    Se creará una nueva versión del registro <strong>{ui.editHook.editData.codigo}</strong>.
                    Si marca esta versión como vigente, todas las versiones anteriores se desactivarán automáticamente.
                  </p>
                </div>
              )}

              <StyledCheckbox
                label="¿Es una nueva versión?"
                checked={ui.editHook.editData?.es_nueva_version || false}
                onChange={(checked) => {
                  ui.editHook.setEditData(prev => prev ? {...prev, es_nueva_version: checked} : null);
                  
                  if (checked) {
                    // Aquí podrías calcular la siguiente versión automáticamente
                    const currentVersion = parseInt(ui.editHook.editData?.version || "0");
                    const nextVersion = currentVersion + 1;
                    ui.editHook.setEditData(prev => prev ? {...prev, version: nextVersion.toString()} : null);
                  }
                }}
              />

              <StyledCheckbox
                label="¿Es Vigente?"
                checked={ui.editHook.editData?.es_vigente || false}
                onChange={(checked) => ui.editHook.setEditData(prev => prev ? {...prev, es_vigente: checked} : null)}
              />

              <InputField
                label="Código"
                name="codigo"
                value={ui.editHook.editData?.codigo || "No aplica"}
                readOnly
                disabled
              />

              <InputField
                label="Fecha de Creación"
                name="fecha_creacion"
                type="date"
                value={ui.editHook.editData?.fecha_creacion || ""}
                readOnly
                disabled
              />

              <InputField
                label="Título"
                name="titulo"
                value={ui.editHook.editData?.descripcion || ""}
                onChange={(e) => ui.editHook.setEditData(prev => prev ? {...prev, descripcion: e.target.value} : null)}
                placeholder="Ingrese título del registro"
                required
                className="w-full"
                disabled={ui.editHook.saving}
              />

              <SelectAutocomplete
                label="Responsable"
                options={ui.responsables}
                optionLabel="nombre_responsable"
                optionValue="id_responsable"
                value={
                  ui.editHook.editData?.id_responsable
                    ? ui.responsables.find(
                      (r) => r.id_responsable === Number(ui.editHook.editData?.id_responsable)
                    ) || null
                    : null
                }
                onChange={(selected) => {
                  ui.editHook.setEditData(prev => prev ? {
                    ...prev, 
                    id_responsable: selected && !Array.isArray(selected) ? String(selected.id_responsable) : ""
                  } : null);
                }}
                placeholder="Selecciona un responsable"
                disabled={ui.loadingResponsables || ui.editHook.saving}
                fullWidth
              />

              <InputField
                label="Revisión"
                name="revision"
                type="number"
                min="0"
                step="1"
                value={ui.editHook.editData?.version || ""}
                onChange={(e) => ui.editHook.setEditData(prev => prev ? {...prev, version: e.target.value} : null)}
                placeholder="0"
                required
                disabled={ui.editHook.saving}
                readOnly={false}
              />

              <InputField
                label="Fecha de Vigencia"
                name="fecha_vigencia"
                type="date"
                value={ui.editHook.editData?.fecha_vigencia || ""}
                onChange={(e) => ui.editHook.setEditData(prev => prev ? {...prev, fecha_vigencia: e.target.value} : null)}
                required
                disabled={ui.editHook.saving}
              />

              <div className="md:col-span-2">
                <PdfInput
                  label={
                    ui.editHook.editData.es_nueva_version
                      ? "Documento PDF (Opcional - Nueva versión)"
                      : "Documento PDF (Opcional - Solo para actualizar)"
                  }
                  pdfFile={ui.editHook.editData?.pdf || null}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    ui.editHook.setEditData(prev => prev ? {...prev, pdf: file} : null);
                  }}
                  onRemove={() => ui.editHook.setEditData(prev => prev ? {...prev, pdf: null} : null)}
                />
                
                {/* Aviso específico para nueva versión sin PDF */}
                {ui.editHook.editData.es_nueva_version && !ui.editHook.editData?.pdf && (
                  <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-sm text-yellow-700">
                      💡 <strong>Información:</strong> Se creará la nueva versión sin documento PDF asociado.
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">
                      Puede agregar un PDF ahora o subirlo más tarde editando esta versión.
                    </p>
                  </div>
                )}
                
                {/* Mostrar PDF actual siempre que exista, incluso en nueva versión */}
                {ui.editHook.editData?.ruta_documento ? (
                  <div className="mt-2 p-2 bg-gray-50 rounded border">
                    <p className="text-sm text-gray-600">
                      <strong>PDF actual:</strong>
                      <button
                        type="button"
                        onClick={() => {
                          if (ui.editHook.editData?.ruta_documento) {
                            window.open(ui.editHook.editData.ruta_documento, '_blank');
                          }
                        }}
                        className="ml-2 text-[#2AAC67] hover:text-[#228B55] underline"
                      >
                        Ver PDF actual
                      </button>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {ui.editHook.editData.es_nueva_version 
                        ? "PDF de la versión anterior - Se mantendrá para versiones previas"
                        : "Selecciona un nuevo archivo solo si deseas reemplazarlo"
                      }
                    </p>
                  </div>
                ) : (
                  <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded">
                    <p className="text-sm text-orange-700">
                      ⚠️ <strong>Sin documento PDF:</strong> Esta versión del registro no tiene un documento PDF asociado.
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                      Puede subir un archivo PDF nuevo usando el selector de archivos arriba.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center mt-8">
              <SubmitButton width="w-40" loading={ui.editHook.saving} disabled={ui.editHook.saving}>
                {ui.editHook.saving
                  ? (ui.editHook.editData.es_nueva_version ? "Creando Versión..." : "Actualizando...")
                  : (ui.editHook.editData.es_nueva_version ? "Crear Nueva Versión" : "Guardar Cambios")
                }
              </SubmitButton>
            </div>
          </FormContainer>
        )}
      </GlobalModal>
    </TableContainer>
  );
};

export default RmList;
