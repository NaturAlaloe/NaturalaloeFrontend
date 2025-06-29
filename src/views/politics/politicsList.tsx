import TableContainer from "../../components/TableContainer";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import GlobalModal from "../../components/globalComponents/GlobalModal";
import SubmitButton from "../../components/formComponents/SubmitButton";
import InputField from "../../components/formComponents/InputField";
import SearchBar from "../../components/globalComponents/SearchBarTable";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import FullScreenSpinner from "../../components/globalComponents/FullScreenSpinner";
import usePoliticsList from "../../hooks/politics/usePoliticsList";
import SelectAutocomplete from "../../components/formComponents/SelectAutocomplete";
import PdfInput from "../../components/formComponents/PdfInput";
import FormContainer from "../../components/formComponents/FormContainer";
import StyledCheckbox from "../../components/formComponents/StyledCheckbox";

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
            className={`border border-gray-300 rounded px-2 py-1 text-sm bg-white ${isVigente ? 'text-green-600 font-medium' : 'text-[#2AAC67]'
              }`}
            value={selectedVersionId || ""}
            onChange={(e) => ui.handleVersionChange(row.codigo_politica, e.target.value)}
            style={{ minWidth: 80 }}
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
      cell: (row: any) => (
        <div className="flex gap-2">
          <a
            href={row.ruta_documento}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2AAC67] hover:text-green-700"
            title="Ver documento"
          >
            <Visibility fontSize="small" />
          </a>
          <button
            className="text-[#2AAC67] hover:text-green-700"
            onClick={() => ui.handleOpenEdit(row)}
            title="Editar"
          >
            <Edit fontSize="small" />
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => ui.handleOpenDelete(row)}
            title="Eliminar"
          >
            <Delete fontSize="small" />
          </button>
        </div>
      ),
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
      <div className="flex items-center justify-between mb-4">
        <SearchBar
          value={ui.search}
          onChange={ui.setSearch}
          placeholder="Buscar política..."
          className="w-full mr-4"
        />
      </div>
      <GlobalDataTable
        columns={columns}
        data={ui.filteredPolitics}
        rowsPerPage={5}
        progressPending={ui.loading}
        currentPage={ui.currentPage}
        onChangePage={ui.setCurrentPage}
      />

      <GlobalModal
        open={ui.modalOpen}
        onClose={() => !ui.saving && ui.setModalOpen(false)}
        title={
          ""
        }
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
                placeholder="1.0"
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
              <SubmitButton width="w-40" disabled={ui.saving} >
                {ui.saving
                  ? (ui.esNuevaVersion ? "Creando Versión..." : "Actualizando...")
                  : (ui.esNuevaVersion ? "Crear Nueva Versión" : "Guardar Cambios")
                }
              </SubmitButton>
            </div>
          </FormContainer>
        )}
      </GlobalModal>

      <GlobalModal
        open={ui.deletePoliticsObj !== null}
        onClose={() => ui.setDeletePoliticsObj(null)}
        title="Eliminar Política"
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
              className="bg-red-500 hover:bg-red-600"
              type="button"
              onClick={ui.handleDelete}
            >
              Eliminar
            </SubmitButton>
          </div>
        }
      >
        <div>¿Estás seguro de que deseas eliminar esta política?</div>
      </GlobalModal>
    </TableContainer>
  );
}