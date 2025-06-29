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
      name: "Descripción",
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
      name: "Revisión",
      selector: (row: { version: string }) => row.version,
      sortable: true,
      width: "120px",
      center: true,
    },
    {
      name: "Fecha Vigencia",
      selector: (row: { fecha_vigencia: string }) => {
        const date = new Date(row.fecha_vigencia);
        date.setDate(date.getDate() + 1); 
        return date.toLocaleDateString();
      },
      sortable: true,
      width: "130px",
      center: true,
    },
    {
      name: "Acciones",
      cell: (row: any) => (
        <div className="flex gap-2">
          <a
            href={row.ruta_documento}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2AAC67]  hover:text-blue-700"
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
        title=""
        maxWidth="lg"
         backgroundColor="#DDF6E8"
      >
        {ui.editPoliticsObj && (
          <FormContainer
            title="Editar Política"
            onSubmit={ui.handleSave}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StyledCheckbox
                label="¿Es una nueva versión?"
                checked={ui.esNuevaVersion || false}
                onChange={(checked) => ui.setEsNuevaVersion(checked)}
                disabled={ui.saving}
              />

              <StyledCheckbox
                label="¿Es Vigente?"
                checked={ui.esVigente || false}
                onChange={(checked) => ui.setEsVigente(checked)}
                disabled={ui.saving}
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
                label="Descripción"
                name="descripcion"
                value={ui.descripcionInput}
                onChange={(e) => ui.setDescripcionInput(e.target.value)}
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
                  ui.responsables.find(
                    (r) => r.id_responsable === Number(ui.responsableInput)
                  ) || null
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
                label="Versión"
                name="version"
                type="number"
                value={ui.versionInput}
                onChange={(e) => ui.setVersionInput(e.target.value)}
                required
                disabled={ui.saving}
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
              </div>
            </div>

            <div className="text-center mt-8">
              <SubmitButton width="w-40" disabled={ui.saving}>
                {ui.saving ? "Guardando..." : "Guardar Cambios"}
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