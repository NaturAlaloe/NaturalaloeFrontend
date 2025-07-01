import FormContainer from '../../components/formComponents/FormContainer';
import InputField from '../../components/formComponents/InputField';
import AutocompleteField from '../../components/formComponents/AutocompleteField';
import SubmitButton from '../../components/formComponents/SubmitButton';
import { useGeneralTraining } from '../../hooks/trainings/useGeneralTraining';
import PaginatedTableModal from '../../components/globalComponents/PaginatedTableModal';
import GlobalDataTable from '../../components/globalComponents/GlobalDataTable';
import GlobalModal from '../../components/globalComponents/GlobalModal';

const GeneralTraining = () => {
    const {
        
        showAsignacionesModal,
        setShowAsignacionesModal,
        handleSubmit,
        formData,
        handleChange,
        colaboradoresDisponibles,
        columnsColaboradores,
        showColaboradoresTable,
        setShowColaboradoresTable,
        colaboradoresAsignados,
        agregarColaboradores,
        isLoading,
        loadingFacilitadores,
        getFacilitadoresOptions,
        
        // Elementos para generales
        generalesDisponibles,
        columnsGenerales,
        showGeneralesTable,
        setShowGeneralesTable,
        generalesAsignadas,
        agregarGenerales,
    } = useGeneralTraining();

    return (
        <FormContainer
            title="Registro de Capacitación General"
            onSubmit={handleSubmit}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <InputField
                    name="titulo"
                    label="Título capacitación:"
                    placeholder="Ingrese el título"
                    className="w-full"
                    value={formData.titulo}
                    onChange={handleChange}
                    required
                />
                
                <AutocompleteField
                    name="facilitador"
                    label="Facilitador:"
                    value={formData.facilitador}
                    onChange={(value) => {
                        handleChange({ target: { name: 'facilitador', value } } as any);
                    }}
                    options={getFacilitadoresOptions()}
                    placeholder={loadingFacilitadores ? "Cargando facilitadores..." : "Escriba o seleccione..."}
                    className="w-full"
                    required
                    disabled={loadingFacilitadores}
                />
                
                <InputField
                    name="fecha"
                    label="Fecha Inicio:"
                    type="date"
                    className="w-full"
                    value={formData.fecha}
                    onChange={handleChange}
                    required
                />
                
                <InputField
                    name="fechaFin"
                    label="Fecha Fin:"
                    type="date"
                    className="w-full"
                    value={formData.fechaFin}
                    onChange={handleChange}
                    required
                />
                
                <InputField
                    name="duracion"
                    label="Duración (horas):"
                    type="number"
                    min="0.1"
                    step="0.1"
                    placeholder="Ej: 2.5"
                    className="w-full"
                    value={formData.duracion}
                    onChange={handleChange}
                    required
                />
                <div className="md:col-span-3">
                    <label htmlFor="comentario" className="block font-semibold text-[#2AAC67] mb-1">
                        Comentario:
                    </label>
                    <textarea
                        id="comentario"
                        name="comentario"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2AAC67] resize-y min-h-[80px]"
                        placeholder="Agrega un comentario..."
                        value={formData.comentario || ""}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="flex justify-center mt-6 gap-4">
                <SubmitButton
                    type="button"
                    onClick={() => setShowAsignacionesModal(true)}
                    width="w-40"
                    disabled={isLoading}
                >
                    Asignar
                </SubmitButton>

                <SubmitButton width="w-40" disabled={isLoading}>
                    {isLoading ? "Guardando..." : "Guardar"}
                </SubmitButton>
            </div>

            {showAsignacionesModal && (
                <GlobalModal
                    open={showAsignacionesModal}
                    title="Asignaciones"
                    onClose={() => setShowAsignacionesModal(false)}
                    maxWidth="md"
                >
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                            <h4 className="font-semibold text-[#15803D] text-lg">
                                Colaboradores asignados
                            </h4>
                            <button
                                className="bg-[#2AAC67] text-white px-4 py-1 rounded hover:bg-[#24965c] text-sm shadow w-full md:w-auto"
                                onClick={() => setShowColaboradoresTable(true)}
                                type="button"
                            >
                                + Agregar
                            </button>
                        </div>
                        <div className="overflow-x-auto rounded-lg border border-[#2AAC67] shadow">
                            <GlobalDataTable
                                columns={columnsColaboradores}
                                data={colaboradoresAsignados}
                                rowsPerPage={5}
                                dense
                                highlightOnHover
                                noDataComponent={
                                    <div className="px-6 py-4 text-center text-sm text-gray-500">
                                        No hay colaboradores asignados
                                    </div>
                                }
                                customStyles={{
                                    headCells: {
                                        style: {
                                            background: "#F0FFF4",
                                            color: "#2AAC67",
                                            fontWeight: "bold",
                                            fontSize: "13px",
                                            textTransform: "uppercase",
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>

                    {/* Sección de Generales */}
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                            <h4 className="font-semibold text-[#15803D] text-lg">
                                Generales asignadas
                            </h4>
                            <button
                                className="bg-[#2AAC67] text-white px-4 py-1 rounded hover:bg-[#24965c] text-sm shadow w-full md:w-auto"
                                onClick={() => setShowGeneralesTable(true)}
                                type="button"
                            >
                                + Agregar
                            </button>
                        </div>
                        <div className="overflow-x-auto rounded-lg border border-[#2AAC67] shadow">
                            <GlobalDataTable
                                columns={columnsGenerales}
                                data={generalesAsignadas}
                                rowsPerPage={5}
                                dense
                                highlightOnHover
                                noDataComponent={
                                    <div className="px-6 py-4 text-center text-sm text-gray-500">
                                        No hay generales asignadas
                                    </div>
                                }
                                customStyles={{
                                    headCells: {
                                        style: {
                                            background: "#F0FFF4",
                                            color: "#2AAC67",
                                            fontWeight: "bold",
                                            fontSize: "13px",
                                            textTransform: "uppercase",
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>

                    {/* Modales para selección */}
                    <PaginatedTableModal
                        open={showColaboradoresTable}
                        onClose={() => setShowColaboradoresTable(false)}
                        title="Selecciona colaboradores para agregar"
                        columns={columnsColaboradores}
                        data={colaboradoresDisponibles}
                        onAdd={agregarColaboradores}
                    />

                    <PaginatedTableModal
                        open={showGeneralesTable}
                        onClose={() => setShowGeneralesTable(false)}
                        title="Selecciona generales para agregar"
                        columns={columnsGenerales}
                        data={generalesDisponibles}
                        onAdd={agregarGenerales}
                    />
                </GlobalModal>
            )}
        </FormContainer>
    );
};

export default GeneralTraining;