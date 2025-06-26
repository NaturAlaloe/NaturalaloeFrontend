import FormContainer from '../../components/formComponents/FormContainer';
import InputField from '../../components/formComponents/InputField';
import SelectField from '../../components/formComponents/SelectField';
import AutocompleteField from '../../components/formComponents/AutocompleteField';
import SubmitButton from '../../components/formComponents/SubmitButton';
import { useCapacitation } from '../../hooks/capacitations/useTraining';
import PaginatedTableModal from '../../components/globalComponents/PaginatedTableModal';
import GlobalDataTable from '../../components/globalComponents/GlobalDataTable';
import GlobalModal from '../../components/globalComponents/GlobalModal';

const Capacitacion = () => {
    const {
        isEvaluado,
        setIsEvaluado,
        showAsignacionesModal,
        setShowAsignacionesModal,
        handleSubmit,
        formData,
        handleChange,
        metodosEvaluacion,
        colaboradoresDisponibles,
        procedimientosDisponibles,
        columnsPoes,
        columnsColaboradores,
        showColaboradoresTable,
        setShowColaboradoresTable,
        showPoesTable,
        setShowPoesTable,
        colaboradoresAsignados,
        poesAsignados,
        agregarColaboradores,
        agregarPoes,
        isLoading,
        loadingFacilitadores,
        getFacilitadoresOptions,
    } = useCapacitation(); return (<FormContainer
        title="Registro de Capacitación"
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
            />                <AutocompleteField
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
            />
            <InputField
                name="fechaFin"
                label="Fecha Fin:"
                type="date"
                className="w-full"
                value={formData.fechaFin}
                onChange={handleChange}
            />            <InputField
                name="duracion"
                label="Duración (horas):"
                type="number"
                min="0.1"
                step="0.1"
                placeholder="Ej: 2.5"
                className="w-full"
                value={formData.duracion}
                onChange={handleChange}
            />
            {isEvaluado && (
                <SelectField
                    name="metodoEvaluacion"
                    label="Método de evaluación:"
                    className="w-full"
                    value={formData.metodoEvaluacion}
                    onChange={handleChange}
                    options={metodosEvaluacion}
                    optionLabel="label"
                    optionValue="value"
                />
            )}
            <div className="flex items-center mt-7">
                <input
                    type="checkbox"
                    id="evaluado"
                    className="accent-[#2ecc71] mr-2 w-5 h-5"
                    checked={isEvaluado}
                    onChange={() => setIsEvaluado(!isEvaluado)}
                />
                <label htmlFor="evaluado" className="font-semibold text-[#2AAC67]">Es Evaluado:</label>
            </div>            <div className="md:col-span-3">
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
        </div>        <div className="flex justify-center mt-6 gap-4">
            <SubmitButton
                type="button"
                onClick={() => setShowAsignacionesModal(true)}
                width="w-40"
                disabled={isLoading}>
                Asignar
            </SubmitButton>

            <SubmitButton width="w-40" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar"}
            </SubmitButton>
        </div>
        {showAsignacionesModal && (
            <GlobalModal
                open={showAsignacionesModal}
                title="Progreso"
                onClose={() => setShowAsignacionesModal(false)}
                maxWidth="md"
            >
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                        <h4 className="font-semibold text-[#15803D] text-lg">Colaboradores asignados</h4>
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
                            noDataComponent={<div className="px-6 py-4 text-center text-sm text-gray-500">No hay colaboradores asignados</div>}
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
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                        <h4 className="font-semibold text-[#15803D] text-lg">POE(s) asignados</h4>
                        <button
                            className="bg-[#2AAC67] text-white px-4 py-1 rounded hover:bg-[#24965c] text-sm shadow w-full md:w-auto"
                            onClick={() => setShowPoesTable(true)}
                            type="button"
                        >
                            + Agregar
                        </button>
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-[#2AAC67] shadow">
                        <GlobalDataTable
                            columns={columnsPoes}
                            data={poesAsignados}
                            rowsPerPage={5}
                            dense
                            highlightOnHover
                            noDataComponent={<div className="px-6 py-4 text-center text-sm text-gray-500">No hay POEs asignados</div>}
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

                <PaginatedTableModal
                    open={showColaboradoresTable}
                    onClose={() => setShowColaboradoresTable(false)}
                    title="Selecciona colaboradores para agregar"
                    columns={columnsColaboradores}
                    data={colaboradoresDisponibles}
                    onAdd={agregarColaboradores}
                />
                <PaginatedTableModal
                    open={showPoesTable}
                    onClose={() => setShowPoesTable(false)}
                    title="Selecciona POEs para agregar"
                    columns={columnsPoes}
                    data={procedimientosDisponibles}
                    onAdd={agregarPoes}
                />
            </GlobalModal>
        )}
    </FormContainer>
    );
};

export default Capacitacion;