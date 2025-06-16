import FormContainer from '../../components/formComponents/FormContainer';
import InputField from '../../components/formComponents/InputField';
import SelectField from '../../components/formComponents/SelectField';
import SubmitButton from '../../components/formComponents/SubmitButton';
import SimpleModal from "../../components/globalComponents/SimpleModal";
import { useCapacitation } from '../../hooks/capacitations/useCapacitation';
import PaginatedTableModal from '../../components/globalComponents/PaginatedTableModal';

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
            {showAsignacionesModal && (
                <SimpleModal
                    open={showAsignacionesModal}
                    title="Progreso"
                    onClose={() => setShowAsignacionesModal(false)}
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
                            <table className="min-w-full divide-y divide-[#2AAC67]">
                                <thead className="bg-[#F0FFF4]">
                                    <tr>
                                        <th className="px-2 py-2 text-left text-xs font-bold text-[#2AAC67] uppercase">Nombre</th>
                                        <th className="px-2 py-2 text-left text-xs font-bold text-[#2AAC67] uppercase">Puesto</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-[#e5e7eb]">
                                    {colaboradoresAsignados.length > 0 ? (
                                        colaboradoresAsignados.map((col) => (
                                            <tr key={col.id}>
                                                <td className="px-2 py-2">{col.nombre}</td>
                                                <td className="px-2 py-2">{col.puesto}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={2} className="px-2 py-4 text-center text-gray-500">No hay colaboradores asignados</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
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
                            <table className="min-w-full divide-y divide-[#2AAC67]">
                                <thead className="bg-[#F0FFF4]">
                                    <tr>
                                        <th className="px-2 py-2 text-left text-xs font-bold text-[#2AAC67] uppercase">Código</th>
                                        <th className="px-2 py-2 text-left text-xs font-bold text-[#2AAC67] uppercase">Título</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-[#e5e7eb]">
                                    {poesAsignados.length > 0 ? (
                                        poesAsignados.map((poe) => (
                                            <tr key={poe.id}>
                                                <td className="px-2 py-2">{poe.codigo}</td>
                                                <td className="px-2 py-2">{poe.titulo}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={2} className="px-2 py-4 text-center text-gray-500">No hay POEs asignados</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
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
                        data={poesDisponibles}
                        onAdd={agregarPoes}
                    />


                </SimpleModal>
            )}
        </FormContainer>
    );
};

export default Capacitacion;