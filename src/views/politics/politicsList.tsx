import TableContainer from "../../components/TableContainer";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import GlobalModal from "../../components/globalComponents/GlobalModal";
import SubmitButton from "../../components/formComponents/SubmitButton";
import InputField from "../../components/formComponents/InputField";
import SearchBar from "../../components/globalComponents/SearchBarTable";
import { Visibility, Edit, Delete, Restore } from "@mui/icons-material";
import FullScreenSpinner from "../../components/globalComponents/FullScreenSpinner";
import usePoliticsList from "../../hooks/politics/usePoliticsList";
import SelectAutocomplete from "../../components/formComponents/SelectAutocomplete";
import PdfInput from "../../components/formComponents/PdfInput";
import FormContainer from "../../components/formComponents/FormContainer";
import StyledCheckbox from "../../components/formComponents/StyledCheckbox";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

export default function PoliticsList() {
  const ui = usePoliticsList();

  const columns = [
    {
      name: "Código",
      selector: (row: { codigo: string }) => row.codigo,
      sortable: true,
      width: "110px",
    },
    {
      name: "Título",
      selector: (row: { descripcion: string }) => row.descripcion,
      sortable: true,
      grow: 2,
      wrap: true,
    },
    {
      name: "Responsable",
      selector: (row: { responsable: string }) => row.responsable,
      sortable: true,
      grow: 1.5,
      wrap: true,
    },
    {
      name: "Fecha Creación",
      selector: (row: { fecha_creacion: string }) => {
        const date = new Date(row.fecha_creacion);
        return date.toLocaleDateString();
      },
      sortable: true,
      grow: 1.5,
      wrap: true,
    },
    {
      name: "Fecha Vigencia",
      selector: (row: { fecha_vigencia: string }) => {
        const date = new Date(row.fecha_vigencia);
        date.setDate(date.getDate() + 1);
        return date.toLocaleDateString();
      },
      sortable: true,
      grow: 1.5,
      wrap: true,
    },
    {
      name: "Revisión",
      cell: (row: any) => {
        const selectedVersionId = ui.selectedVersions[row.codigo_politica];
        const selectedVersion = row.versiones?.find((v: any) => v.id_documento === selectedVersionId);
        const isVigente = selectedVersion?.vigente === 1;

        return (
          <select
            className={`border border-gray-300 rounded px-2 py-1 text-sm bg-white ${
              isVigente ? 'text-green-600 font-medium' : 'text-[#2AAC67]'
            } ${ui.politicsFilter === 'obsolete' ? 'opacity-60' : ''}`}
            value={selectedVersionId || ""}
            onChange={(e) => ui.handleVersionChange(row.codigo_politica, e.target.value)}
            style={{ minWidth: 80 }}
            disabled={ui.politicsFilter === 'obsolete'}
          >
            <option value="">Seleccionar</option>
            {row.versiones?.map((version: any) => (
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
      grow: 1.5,
      wrap: true,
    },
    {
      name: "Acciones",
      cell: (row: any) => {
        const selectedVersionId = ui.selectedVersions[row.codigo_politica];
        const selectedVersion = row.versiones?.find((v: any) => v.id_documento === selectedVersionId);
        const isObsolete = ui.politicsFilter === 'obsolete';

        return (
          <div className="flex gap-2">
            <button
              className="text-[#2AAC67] hover:text-green-700"
              title="Ver PDF"
              onClick={() => {
                if (!selectedVersion?.ruta_documento) {
                  showCustomToast(
                    "Documento no disponible",
                    `No se encontró el archivo PDF para la versión ${selectedVersion?.revision || "actual"} de la política ${row.codigo_politica}`,
                    "error"
                  );
                  return;
                }
                window.open(selectedVersion.ruta_documento, "_blank");
              }}
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
              onClick={() => ui.handleOpenDelete(row)}
              title={isObsolete ? "Reactivar" : "Marcar como obsoleta"}
            >
              {isObsolete ? <Restore fontSize="small" /> : <Delete fontSize="small" />}
            </button>
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "110px",
      center: true,
    },
  ];

  return (
    <TableContainer title="Políticas">
      {ui.loading && <FullScreenSpinner />}
      
      <div className="flex items-center justify-between mb-4 gap-4">
    
       

        <SearchBar
          value={ui.search}
          onChange={ui.setSearch}
          placeholder={`Buscar ${ui.politicsFilter === 'active' ? 'políticas activas' : 'políticas obsoletas'}...`}
          className="flex-1"
        />
         <div className="flex items-center gap-2">
         
          <select
            className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-transparent hover:border-gray-400"
            value={ui.politicsFilter}
            onChange={(e) => ui.handleFilterChange(e.target.value as 'active' | 'obsolete')}
          >
            <option  value="active">Políticas Activas</option>
            <option value="obsolete">Políticas Obsoletas</option>
          </select>
        </div>
      </div>

      <GlobalDataTable
        columns={columns}
        data={ui.filteredPolitics}
        rowsPerPage={10}
        progressPending={ui.loading}
        currentPage={ui.currentPage}
        onChangePage={ui.setCurrentPage}
      />

      {/* Modal de edición - solo para políticas activas */}
      <GlobalModal
        open={ui.modalOpen}
        onClose={() => !ui.saving && ui.setModalOpen(false)}
        title=""
        maxWidth="lg"
        backgroundColor="#DDF6E8"
      >
        {ui.editPoliticsObj && (
          <FormContainer
            title={
              ui.esNuevaVersion
                ? "Crear Nueva Versión"
                : "Editar Política"
            }
            onSubmit={ui.handleSave}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ui.esNuevaVersion && (
                <div className="md:col-span-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">📋 Creando Nueva Versión</h4>
                  <p className="text-gray-700 text-sm">
                    Se creará una nueva versión de la política <strong>{ui.editPoliticsObj.codigo_politica}</strong>.
                    Si marca esta versión como vigente, todas las versiones anteriores se desactivarán automáticamente.
                  </p>
                </div>
              )}

              <StyledCheckbox
                label="¿Es una nueva versión?"
                checked={ui.esNuevaVersion || false}
                onChange={(checked) => ui.setEsNuevaVersion(checked)}
              />

              <StyledCheckbox
                label="¿Es Vigente?"
                checked={ui.esVigente || false}
                onChange={(checked) => ui.setEsVigente(checked)}
              />

              <InputField
                label="Código"
                name="codigo"
                value={ui.editPoliticsObj.codigo || "No aplica"}
                readOnly
                disabled
              />

              <InputField
                label="Fecha de Creación"
                name="fecha_creacion"
                type="date"
                value={ui.fechaCreacionInput || ""}
                readOnly
                disabled
              />

              <InputField
                label="Título"
                name="titulo"
                value={ui.descripcionInput}
                onChange={(e) => ui.setDescripcionInput(e.target.value)}
                placeholder="Ingrese título de la política"
                required
                className="w-full"
                disabled={ui.saving}
              />

              <SelectAutocomplete
                label="Responsable"
                options={ui.responsables}
                optionLabel="nombre_responsable"
                optionValue="id_responsable"
                value={
                  ui.responsableInput
                    ? ui.responsables.find(
                      (r) => r.id_responsable === Number(ui.responsableInput)
                    ) || null
                    : null
                }
                onChange={(selected) => {
                  ui.setResponsableInput(
                    selected && !Array.isArray(selected) ? String(selected.id_responsable) : ""
                  );
                }}
                placeholder="Selecciona un responsable"
                disabled={ui.loadingResponsables || ui.saving}
                fullWidth
              />

              <InputField
                label="Revisión"
                name="revision"
                type="number"
                min="1"
                step="1"
                value={ui.versionInput}
                onChange={(e) => ui.setVersionInput(e.target.value)}
                placeholder="0"
                required
                disabled={ui.saving || !ui.esNuevaVersion}
                readOnly={!ui.esNuevaVersion}
              />

              <InputField
                label="Fecha de Vigencia"
                name="fecha_vigencia"
                type="date"
                value={ui.fechaVigenciaInput}
                onChange={(e) => ui.setFechaVigenciaInput(e.target.value)}
                required
                disabled={ui.saving}
              />

              <div className="md:col-span-2">
                <PdfInput
                  label="Documento PDF (Opcional - Solo para actualizar)"
                  pdfFile={ui.pdfFile}
                  onChange={ui.handlePdfChange}
                  onRemove={() => ui.setPdfFile(null)}
                />
                {ui.editPoliticsObj?.ruta_documento ? (
                  <div className="mt-2 p-2 bg-gray-50 rounded border">
                    <p className="text-sm text-gray-600">
                      <strong>PDF actual:</strong>
                      <button
                        type="button"
                        onClick={() => {
                          if (ui.editPoliticsObj?.ruta_documento) {
                            window.open(ui.editPoliticsObj.ruta_documento, '_blank');
                          }
                        }}
                        className="ml-2 text-[#2AAC67] hover:text-[#228B55] underline"
                      >
                        Ver PDF actual
                      </button>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Selecciona un nuevo archivo solo si deseas reemplazarlo
                    </p>
                  </div>
                ) : (
                  <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded">
                    <p className="text-sm text-orange-700">
                      ⚠️ <strong>Sin documento PDF:</strong> Esta versión de la política no tiene un documento PDF asociado.
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                      Puede subir un archivo PDF nuevo usando el selector de archivos arriba.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center mt-8">
              <SubmitButton width="w-40" loading={ui.saving} disabled={ui.saving}>
                {ui.saving
                  ? (ui.esNuevaVersion ? "Creando Versión..." : "Actualizando...")
                  : (ui.esNuevaVersion ? "Crear Nueva Versión" : "Guardar Cambios")
                }
              </SubmitButton>
            </div>
          </FormContainer>
        )}
      </GlobalModal>

      {/* Modal de confirmación para obsolescencia/reactivación */}
      <GlobalModal
        open={ui.deletePoliticsObj !== null}
        onClose={() => ui.setDeletePoliticsObj(null)}
        title={ui.politicsFilter === 'active' ? "Marcar como obsoleto" : "Reactivar política"}
        maxWidth="sm"
        actions={
          <div className="flex gap-2">
            <SubmitButton
              className="bg-gray-400 hover:bg-gray-500"
              type="button"
              onClick={() => ui.setDeletePoliticsObj(null)}
            >
              Cancelar
            </SubmitButton>
            <SubmitButton
              className={ui.politicsFilter === 'active' 
                ? "bg-red-500 hover:bg-red-600" 
                : "bg-{#2BAC69} hover:bg-green-700"
              }
              type="button"
              onClick={ui.handleAskReason}
            >
              {ui.politicsFilter === 'active' ? "Continuar" : "Continuar"}
            </SubmitButton>
          </div>
        }
      >
        <div className="space-y-2">
          <p>
            {ui.politicsFilter === 'active' 
              ? "¿Estás seguro de que deseas marcar esta política como obsoleta?"
              : "¿Estás seguro de que deseas reactivar esta política?"
            }
          </p>
          {ui.deletePoliticsObj && (
            <div className="bg-gray-50 p-3 rounded border">
              <p className="text-sm"><strong>Código:</strong> {ui.deletePoliticsObj.codigo_politica}</p>
              <p className="text-sm"><strong>Título:</strong> {ui.deletePoliticsObj.descripcion}</p>
              <p className="text-sm"><strong>Revisión:</strong> {ui.deletePoliticsObj.revision || ui.deletePoliticsObj.version}</p>
            </div>
          )}
       
        </div>
      </GlobalModal>

      {/* Modal para razón de obsolescencia o reactivación */}
      <GlobalModal
        open={ui.reasonModalOpen}
        onClose={() => ui.setReasonModalOpen(false)}
        title={ui.politicsFilter === 'active' ? "Razón de obsolescencia" : "Razón de reactivación"}
        maxWidth="sm"
        actions={
          <div className="flex gap-2">
            <SubmitButton
              className="bg-gray-400 hover:bg-gray-500"
              type="button"
              onClick={() => ui.setReasonModalOpen(false)}
              disabled={ui.loading}
            >
              Cancelar
            </SubmitButton>
            <SubmitButton
              className={ui.politicsFilter === 'active' 
                ? "bg-red-500 hover:bg-red-600" 
                : "bg-{#2BAC67} hover:bg-green-700"
              }
              type="button"
              onClick={ui.handleConfirmDelete}
              disabled={!ui.deleteReason.trim() || ui.loading}
              loading={ui.loading}
            >
              {ui.politicsFilter === 'active' ? "Confirmar obsolescencia" : "Confirmar reactivación"}
            </SubmitButton>
          </div>
        }
      >
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            {ui.politicsFilter === 'active' 
              ? "Escribe la razón por la que esta política será marcada como obsoleta:"
              : "Escribe la razón por la que esta política será reactivada:"
            }
          </label>
          <textarea
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-transparent"
            rows={3}
            value={ui.deleteReason}
            onChange={e => ui.setDeleteReason(e.target.value)}
            placeholder={ui.politicsFilter === 'active' 
              ? "Ej: Política actualizada por cambios normativos..."
              : "Ej: Se requiere reactivar esta política por cambios organizacionales..."
            }
            autoFocus
            required
            disabled={ui.loading}
          />
          
        </div>
      </GlobalModal>
    </TableContainer>
  );
}