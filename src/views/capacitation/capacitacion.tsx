import FormContainer from '../../components/formComponents/FormContainer';
import InputField from '../../components/formComponents/InputField';
import SelectField from '../../components/formComponents/SelectField';
import SubmitButton from '../../components/formComponents/SubmitButton';
import SimpleModal from "../../components/globalComponents/SimpleModal";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import { useCapacitation } from '../../hooks/capacitations/useCapacitation';

const Capacitacion = () => {
    const {
        isEvaluado,
        setIsEvaluado,
        showAsignacionesModal,
        setShowAsignacionesModal,
        handleSubmit,
        formData,
        handleChange,
        facilitadores,
        tiposCapacitacion,
        metodosEvaluacion,
        // Lógica para asignaciones:
        colaboradoresDisponibles,
        poesDisponibles,
        columnsColaboradores,
        columnsPoes,
        showColaboradoresTable,
        setShowColaboradoresTable,
        showPoesTable,
        setShowPoesTable,
        colaboradoresAsignados,
        poesAsignados,
        setSelectedColaboradores,
        setSelectedPoes,
        agregarColaboradores,
        agregarPoes,
    } = useCapacitation();

    return (
        <FormContainer title="Registro de Capacitación" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <InputField
                    name="titulo"
                    label="Título capacitación:"
                    placeholder="Ingrese el título"
                    className="w-full"
                    value={formData.titulo}
                    onChange={handleChange}
                />
                <SelectField
                    name="tipoCapacitacion"
                    label="Tipo capacitación:"
                    className="w-full"
                    value={formData.tipoCapacitacion}
                    onChange={handleChange}
                    options={tiposCapacitacion}
                    optionLabel="label"
                    optionValue="value"
                />
                <SelectField
                    name="facilitador"
                    label="Facilitador:"
                    className="w-full"
                    value={formData.facilitador}
                    onChange={handleChange}
                    options={[
                        { value: "", label: "Seleccione...", disabled: true },
                        ...facilitadores.map(f => ({ value: f.nombre, label: f.nombre })),
                    ]}
                    optionLabel="label"
                    optionValue="value"
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
                />
                <InputField
                    name="duracion"
                    label="Duración (horas):"
                    type="time"
                    min="00:01"
                    step="60"
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
                </div>
            </div>
            <div className="flex justify-center mt-6 gap-4">
                <SubmitButton width="w-40">
                    Guardar
                </SubmitButton>
                <SubmitButton
                    type="button"
                    onClick={() => setShowAsignacionesModal(true)}
                    width="w-40">
                    Asignar
                </SubmitButton>
            </div>
            {/* Modal de asignaciones */}
            {showAsignacionesModal && (
                <SimpleModal
                    open={showAsignacionesModal}
                    title="Progreso"
                    onClose={() => setShowAsignacionesModal(false)}
                >
                    {/* Colaboradores asignados */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-[#15803D]">Colaboradores asignados:</h4>
                            <button
                                className="bg-[#2AAC67] text-white px-4 py-1 rounded hover:bg-[#24965c] text-sm"
                                onClick={() => setShowColaboradoresTable(true)}
                                type="button"
                            >
                                Agregar colaboradores
                            </button>
                        </div>
                        <ul className="list-disc ml-6">
                            {colaboradoresAsignados.map((col) => (
                                <li key={col.id} className="text-[#222]">{col.nombre} - {col.puesto}</li>
                            ))}
                        </ul>
                    </div>
                    {/* Tabla para seleccionar colaboradores */}
                    {showColaboradoresTable && (
                        <div className="mb-4">
                            <GlobalDataTable
                                columns={columnsColaboradores}
                                data={colaboradoresDisponibles}
                                selectableRows
                                onSelectedRowsChange={({ selectedRows }: { selectedRows: any[] }) => setSelectedColaboradores(selectedRows)}
                                pagination={false}
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    className="bg-[#2AAC67] text-white px-4 py-1 rounded hover:bg-[#24965c]"
                                    onClick={agregarColaboradores}
                                    type="button"
                                >
                                    Añadir seleccionados
                                </button>
                                <button
                                    className="bg-gray-300 px-4 py-1 rounded"
                                    onClick={() => setShowColaboradoresTable(false)}
                                    type="button"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}

                    {/* POEs asignados */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-[#15803D]">POE(s) asignados:</h4>
                            <button
                                className="bg-[#2AAC67] text-white px-4 py-1 rounded hover:bg-[#24965c] text-sm"
                                onClick={() => setShowPoesTable(true)}
                                type="button"
                            >
                                Agregar POEs
                            </button>
                        </div>
                        <ul className="list-disc ml-6">
                            {poesAsignados.map((poe) => (
                                <li key={poe.id} className="text-[#222]">{poe.codigo} - {poe.titulo}</li>
                            ))}
                        </ul>
                    </div>
                    {/* Tabla para seleccionar POEs */}
                    {showPoesTable && (
                        <div className="mb-4">
                            <GlobalDataTable
                                columns={columnsPoes}
                                data={poesDisponibles}
                                selectableRows
                                onSelectedRowsChange={({ selectedRows }: { selectedRows: any[] }) => setSelectedPoes(selectedRows)}
                                pagination={false}
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    className="bg-[#2AAC67] text-white px-4 py-1 rounded hover:bg-[#24965c]"
                                    onClick={agregarPoes}
                                    type="button"
                                >
                                    Añadir seleccionados
                                </button>
                                <button
                                    className="bg-gray-300 px-4 py-1 rounded"
                                    onClick={() => setShowPoesTable(false)}
                                    type="button"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}
                </SimpleModal>
            )}
        </FormContainer>
    );
};

export default Capacitacion;