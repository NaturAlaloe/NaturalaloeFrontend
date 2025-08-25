import useListDeletedCollaborators from "../../hooks/collaborators/useListDeletedCollaborators";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import FullScreenSpinner from "../../components/globalComponents/FullScreenSpinner";
import TableContainer from "../../components/TableContainer";
import GlobalModal from "../../components/globalComponents/GlobalModal";
import { Visibility } from "@mui/icons-material";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

export default function ListOfDeletedCollaborators() {
    const {
        loading,
        filteredCollaborators,
        columns,
        modalOpen,
        selectedCollaborator,
        handleOpenModal,
        handleCloseModal,
        parseArrayData
    } = useListDeletedCollaborators();

    // Mostrar spinner mientras carga
    if (loading) {
        return <FullScreenSpinner />;
    }

    // Modificar columnas para agregar la acción
    const columnsWithActions = columns.map((col: any) => {
        if (col.name === "Acciones") {
            return {
                ...col,
                cell: (row: any) => {
                    try {
                        return (
                            <button
                                onClick={() => handleOpenModal(row)}
                                className="text-green-600 hover:text-green-800 flex items-center gap-1"
                                title="Ver detalles"
                            >
                                <Visibility fontSize="small" />
                            </button>
                        );
                    } catch (err: any) {
                        showCustomToast("Error", "Error al mostrar la acción", "error");
                        console.error("Error in action button:", err);
                        return null;
                    }
                }
            };
        }
        return col;
    });

    return (
        <>
            <TableContainer title="Colaboradores Eliminados">
                <GlobalDataTable
                    columns={columnsWithActions}
                    data={filteredCollaborators}
                    pagination
                    highlightOnHover
                    pointerOnHover
                    paginationComponentOptions={{
                        rowsPerPageText: "Filas por página",
                        rangeSeparatorText: "de",
                        noRowsPerPage: false,
                        selectAllRowsItem: false,
                        selectAllRowsItemText: "Todos",
                    }}
                   
                />
            </TableContainer>

            {/* Modal para mostrar detalles */}
            <GlobalModal
                open={modalOpen}
                onClose={handleCloseModal}
                title={`Detalles de ${selectedCollaborator?.nombre_completo || 'Colaborador'}`}
            >
                {selectedCollaborator && (
                    <div className="space-y-6">


                        {/* Roles */}
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-green-800 mb-3">Roles</h3>
                            <div className="flex flex-wrap gap-2">
                                {parseArrayData(selectedCollaborator.roles).map((role, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm"
                                    >
                                        {role}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Capacitaciones Realizadas */}
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-green-800 mb-3">Capacitaciones Realizadas</h3>
                            <div className="flex flex-wrap gap-2">
                                {parseArrayData(selectedCollaborator.capacitaciones_realizadas).map((capacitacion, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm"
                                    >
                                        {capacitacion}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Capacitaciones Generales */}
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-green-800 mb-3">Capacitaciones Generales</h3>
                            <div className="flex flex-wrap gap-2">
                                {parseArrayData(selectedCollaborator.capacitaciones_generales).map((capacitacion, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm"
                                    >
                                        {capacitacion}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </GlobalModal>
        </>
    );
}
