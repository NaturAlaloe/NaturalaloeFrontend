import {
  Search,
  Person,
  Badge,
  Apartment,
  Work,
  EditNote,
  ChatBubble,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import { useState } from "react";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import FullScreenSpinner from "../../components/globalComponents/FullScreenSpinner";
import GlobalModal from "../../components/globalComponents/GlobalModal";
import { useTrainingList } from "../../hooks/trainings/useTrainingList";
import type { Training } from "../../hooks/trainings/useTrainingList";

export default function ListTrainings() {
  const {
    trainings: trainings,
    searchTerm,
    setSearchTerm,
    showModal,
    setShowModal,
    selectedTraining: selectedTraining,
    handleRowClick,
    navegarCapacitacionFinalizada,
    isLoading,
  } = useTrainingList();

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentToShow, setCommentToShow] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  if (isLoading) return <FullScreenSpinner />;

  const columns = [
    {
      name: "POE",
      selector: (row: any) => row.poe,
      sortable: true,
      cell: (row: any) => (
        <div className="text-sm font-medium text-gray-900 py-2 min-h-[56px] flex items-center">
          {row.isGrouped ? (
            <div className="flex items-center">
              <button
                onClick={() => toggleExpanded(row.id)}
                className="flex items-center text-[#2AAC67] hover:text-[#1e8449]"
              >
                {expandedRows.has(row.id) ? <ExpandLess /> : <ExpandMore />}
                <span className="ml-1">{row.poe}</span>
              </button>
            </div>
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
          {/* Botón de calificar examen - disponible para todos los POEs */}
          <button
            className="action-button text-[#2AAC67] hover:text-[#1e8449] transition-colors font-semibold"
            onClick={() => navegarCapacitacionFinalizada(row.poe)}
            title="Calificar examen"
          >
            <EditNote />
          </button>
          
          {/* Botón de comentario - solo para POEs padre (no sub-filas) */}
          {!row.isSubRow && (
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
          )}
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  // Crear datos expandidos que incluyan las sub-capacitaciones
  const getExpandedData = () => {
    const result: any[] = [];

    trainings.forEach((cap) => {
      result.push(cap);

      if (cap.isGrouped && cap.subTrainings && expandedRows.has(cap.id)) {
        cap.subTrainings.forEach((subCap) => {
          result.push({
            ...subCap,
            isSubRow: true,
            parentId: cap.id,
          });
        });
      }
    });

    return result;
  };

  // Calcular el número de elementos por página considerando las expansiones
  const hasExpandedRows = expandedRows.size > 0;
  const expandedData = getExpandedData();
  const baseItemsPerPage = 10;
  const itemsPerPage = hasExpandedRows
    ? Math.min(50, Math.max(baseItemsPerPage, expandedData.length))
    : baseItemsPerPage;

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
          data={expandedData}
          pagination={true}
          paginationPerPage={itemsPerPage}
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
          onRowClicked={(row: Training) => {
            if (row.isSubRow) {
              // No hacer nada al hacer click en sub-filas
              return;
            } else if (row.isGrouped) {
              // Mostrar modal con todos los colaboradores agrupados para capacitaciones grupales
              handleRowClick(row);
            } else if (!row.isGrouped) {
              // Mostrar modal para capacitaciones individuales
              handleRowClick(row);
            }
          }}
          progressPending={isLoading}
          conditionalRowStyles={[
            {
              when: (row: any) => row.isSubRow,
              style: {
                backgroundColor: "#f8f9fa",
                paddingLeft: "2rem",
                borderLeft: "3px solid #2AAC67",
                cursor: "default", // Cambiar cursor para indicar que no es clickeable
              },
            },
          ]}
        />
      </div>
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
                {selectedTraining.colaboradores.map(
                  (colaborador, index) => (
                    <details
                      key={index}
                      className="rounded-lg border border-[#2ecc71] bg-[#f6fff6]"
                    >
                      <summary className="flex items-center px-3 py-2 cursor-pointer select-none font-semibold text-[#2ecc71]">
                        <Person className="mr-2" />
                        {colaborador.nombreCompleto}
                        <span className="ml-auto text-[#2ecc71]">▼</span>
                      </summary>
                      <div className="px-3 pb-3 pt-2">
                        <div className="mb-2 flex items-center">
                          <Badge className="mr-2 text-[#2ecc71]" />
                          <span className="font-semibold mr-1">
                            Cédula:
                          </span>{" "}
                          {colaborador.cedula}
                        </div>
                        <div className="mb-2 flex items-center">
                          <Apartment className="mr-2 text-[#2ecc71]" />
                          <span className="font-semibold mr-1">
                            Departamento:
                          </span>{" "}
                          {colaborador.departamento}
                        </div>
                        <div className="mb-2 flex items-center">
                          <Work className="mr-2 text-[#2ecc71]" />
                          <span className="font-semibold mr-1">
                            Puesto:
                          </span>{" "}
                          {colaborador.puesto}
                        </div>
                      </div>
                    </details>
                  )
                )}
              </div>
            </div>
            <div>
              <h3 className="text-[#2ecc71] font-bold text-lg mb-4 text-center md:text-left mt-8 md:mt-0">
                Información del Facilitador
              </h3>
              <div className="mb-4">
                <details className="rounded-lg border border-[#2ecc71] bg-[#f6fff6]">
                  <summary className="flex items-center px-3 py-2 cursor-pointer select-none font-semibold text-[#2ecc71]">
                    <Person className="mr-2" />
                    {selectedTraining.profesor.nombre}{" "}
                    {selectedTraining.profesor.apellido}
                    <span className="ml-auto">▼</span>
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
