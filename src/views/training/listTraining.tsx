import {
  Search,
  Person,
  Badge,
  Assignment,
  EditNote,
  ChatBubble,
  Visibility,
} from "@mui/icons-material";
import { useState } from "react";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import FullScreenSpinner from "../../components/globalComponents/FullScreenSpinner";
import GlobalModal from "../../components/globalComponents/GlobalModal";
import { useTrainingList } from "../../hooks/trainings/useTrainingList";

export default function ListTrainings() {
  const {
    trainings,
    searchTerm,
    setSearchTerm,
    showModal,
    setShowModal,
    showPoeModal,
    setShowPoeModal,
    selectedTraining,
    handleRowClick,
    handlePoeClick,
    navegarCapacitacionFinalizada,
    isLoading,
  } = useTrainingList();

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentToShow, setCommentToShow] = useState<string | null>(null);

  if (isLoading) return <FullScreenSpinner />;

  const columns = [
    {
      name: "POE",
      selector: (row: any) => row.poe,
      sortable: true,
      cell: (row: any) => (
        <div className="text-sm font-medium text-gray-900 py-2 min-h-[56px] flex items-center">
          {row.isGrouped && row.subTrainings && row.subTrainings.length > 0 ? (
            <button
              onClick={() => handlePoeClick(row)}
              className="text-[#2AAC67] hover:text-[#1e8449] cursor-pointer"
            >
              {row.poe}
            </button>
          ) : (
            row.poe
          )}
        </div>
      ),
      wrap: true,
    },
    {
      name: "TÍTULO",
      selector: (row: any) => row.titulo,
      sortable: true,
      cell: (row: any) => (
        <div className="text-sm text-gray-700 py-2 min-h-[56px] flex items-center">
          {row.titulo}
        </div>
      ),
      wrap: true,
    },
    {
      name: "DURACIÓN (h)",
      selector: (row: any) => row.duracion,
      sortable: true,
      cell: (row: any) => (
        <div className="text-sm text-gray-700 py-2 min-h-[56px] flex items-center">
          {row.duracion}
        </div>
      ),
      wrap: true,
    },
    {
      name: "FECHA FINAL",
      selector: (row: any) => row.fechaFinal,
      sortable: true,
      cell: (row: any) => (
        <div className="text-sm text-gray-700 py-2 min-h-[56px] flex items-center">
          {row.fechaFinal}
        </div>
      ),
    },
    {
      name: "ESTADO",
      selector: (row: any) => row.estado,
      sortable: true,
      cell: (row: any) => (
        <div className="text-sm text-gray-700 capitalize py-2min-h-[56px] flex items-center">
          {row.estado}
        </div>
      ),
      wrap: true,
    },
    {
      name: "TIPO",
      selector: (row: any) => row.tipo,
      sortable: true,
      cell: (row: any) => (
        <div className="text-sm text-gray-700 capitalize py-2 min-h-[56px] flex items-center">
          {row.tipo}
        </div>
      ),
      wrap: true,
    },
    {
      name: "SEGUIMIENTO",
      selector: (row: any) => row.seguimiento,
      sortable: true,
      cell: (row: any) => (
        <div className="text-sm text-gray-700 capitalize py-2 min-h-[56px] flex items-center">
          {row.seguimiento}
        </div>
      ),
      wrap: true,
    },
    {
      name: "ACCIONES",
      cell: (row: any) => (
        <div className="flex flex-col sm:flex-row gap-2 items-center justify-center py-2 min-h-[56px]">
          <button
            className="text-[#2AAC67] hover:text-[#1e8449] transition-colors"
            onClick={() => handleRowClick(row)}
            title="Ver detalles"
          >
            <Visibility />
          </button>

          {row.estado.toLowerCase() !== "finalizada" && (
            <button
              className="action-button text-[#2AAC67] hover:text-[#1e8449] transition-colors font-semibold"
              onClick={() => navegarCapacitacionFinalizada(row.id)}
              title="Calificar examen"
            >
              <EditNote />
            </button>
          )}

          <button
            className="text-[#2AAC67] hover:text-[#1e8449] transition-colors"
            onClick={() => {
              setCommentToShow(row.comentario);
              setShowCommentModal(true);
            }}
            title="Ver comentario"
          >
            <ChatBubble />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const customRowStyles = {
    headCells: {
      style: {
        background: "#F0FFF4",
        color: "#2AAC67",
        fontWeight: "bold",
        fontSize: "13px",
        textTransform: "uppercase",
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#2AAC67] pb-2">
        Capacitaciones de la Empresa
      </h1>
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-[#2AAC67] sm:text-sm"
          placeholder="Buscar por POE, título, estado, tipo o seguimiento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border border-gray-200 rounded-lg overflow-x-auto">
        <GlobalDataTable
          key={`training-table-${searchTerm}`}
          columns={columns}
          data={trainings}
          pagination={true}
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 25, 50]}
          highlightOnHover
          dense={false}
          noDataComponent={
            <div className="px-6 py-4 text-center text-sm text-gray-500">
              {isLoading
                ? "Cargando capacitaciones..."
                : "No se encontraron capacitaciones"}
            </div>
          }
          customStyles={customRowStyles}
          onRowClicked={() => { }}
          progressPending={isLoading}
        />
      </div>


      <GlobalModal
        open={showPoeModal}
        onClose={() => setShowPoeModal(false)}
        title="POEs de la Capacitación Grupal"
        maxWidth="md"
      >
        {selectedTraining && selectedTraining.subTrainings && (
          <div className="space-y-3">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-[#2AAC67] mb-2">
                {selectedTraining.titulo}
              </h3>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">
                POEs de la Capacitación:
              </h4>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                <span className="font-medium text-gray-900">
                  {selectedTraining.poe}
                </span>
              </div>

              {selectedTraining.subTrainings.map((subTraining, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <span className="font-medium text-gray-900">
                    {subTraining.poe}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </GlobalModal>


      <GlobalModal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Detalles de Capacitación"
        maxWidth="md"
      >
        {selectedTraining && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-[#2ecc71] font-bold text-lg mb-4 text-center md:text-left">
                Información de los Colaboradores
              </h3>
              <div className="space-y-3">
                {selectedTraining.colaboradores.map((colaborador, index) => (
                  <details
                    key={index}
                    className="rounded-lg border border-[#2ecc71] bg-[#f6fff6]"
                  >
                    <summary className="flex items-center px-3 py-2 cursor-pointer select-none font-semibold text-gray-900">
                      <Person className="mr-2 text-[#2ecc71]" />
                      {colaborador.nombreCompleto}
                      <span className="ml-auto text-[#2ecc71]">▼</span>
                    </summary>
                    <div className="px-3 pb-3 pt-2">
                      <div className="mb-2 flex items-center">
                        <Badge className="mr-2 text-[#2ecc71]" />
                        <span className="font-semibold mr-1">Cédula:</span>{" "}
                        {colaborador.cedula}
                      </div>
                      {selectedTraining.estado.toLowerCase() === "finalizada" && (
                        <>

                          {selectedTraining.metodo?.toLowerCase() === "teórico" &&
                            colaborador.nota !== null &&
                            colaborador.nota !== undefined && (
                              <div className="mb-2 flex items-center">
                                <Assignment className="mr-2 text-[#2ecc71]" />
                                <span className="font-semibold mr-1">Nota:</span>
                                <span>{colaborador.nota}</span>
                              </div>
                            )}


                          {selectedTraining.metodo?.toLowerCase() === "práctico" &&
                            colaborador.is_aprobado !== null &&
                            colaborador.is_aprobado !== undefined && (
                              <div className="mb-2 flex items-center">
                                <Assignment className="mr-2 text-[#2ecc71]" />
                                <span className="font-semibold mr-1">Estado:</span>
                                <span className={`font-medium ${colaborador.is_aprobado === "aprobado"
                                  ? "text-green-600"
                                  : "text-red-600"
                                  }`}>
                                  {colaborador.is_aprobado === "aprobado" ? "Aprobado" : "Reprobado"}
                                </span>
                              </div>
                            )}


                          {(!selectedTraining.metodo ||
                            (selectedTraining.metodo.toLowerCase() !== "teórico" &&
                              selectedTraining.metodo.toLowerCase() !== "práctico")) &&
                            colaborador.nota !== null &&
                            colaborador.nota !== undefined && (
                              <div className="mb-2 flex items-center">
                                <Assignment className="mr-2 text-[#2ecc71]" />
                                <span className="font-semibold mr-1">Nota:</span>
                                <span>{colaborador.nota}</span>
                              </div>
                            )}
                        </>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-[#2ecc71] font-bold text-lg mb-4 text-center md:text-left mt-8 md:mt-0">
                Información del Facilitador
              </h3>
              <div className="mb-4">
                <details className="rounded-lg border border-[#2ecc71] bg-[#f6fff6]">
                  <summary className="flex items-center px-3 py-2 cursor-pointer select-none font-semibold text-gray-900">
                    <Person className="mr-2 text-[#2ecc71]" />
                    {selectedTraining.profesor.nombre}{" "}
                    {selectedTraining.profesor.apellido}
                    <span className="ml-auto text-[#2ecc71]">▼</span>
                  </summary>
                  <div className="px-3 pb-3 pt-2">
                    <div className="mb-2 flex items-center">
                      <Badge className="mr-2 text-[#2ecc71]" />
                      <span className="font-semibold mr-1">
                        Identificación:
                      </span>{" "}
                      {selectedTraining.profesor.identificacion}
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </div>
        )}
      </GlobalModal>

      {showCommentModal && (
        <GlobalModal
          open={showCommentModal}
          onClose={() => setShowCommentModal(false)}
          title="Comentario"
          maxWidth="xs"
        >
          <div className="text-gray-800 text-sm whitespace-pre-line break-words">
            {commentToShow}
          </div>
        </GlobalModal>
      )}
    </div>
  );
}
