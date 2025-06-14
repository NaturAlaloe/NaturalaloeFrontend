import { useCapacitation } from "../../hooks/capacitations/useCapacitation";
import FormContainer from '../../components/formComponents/FormContainer';
import InputField from '../../components/formComponents/InputField';
import SelectField from '../../components/formComponents/SelectField';
import SubmitButton from '../../components/formComponents/SubmitButton';
import SimpleModal from "../../components/globalComponents/SimpleModal";


const Capacitacion = () => {
    const {
        showColaboradorModal,
        setShowColaboradorModal,
        showFacilitadorModal,
        setShowFacilitadorModal,
        isEvaluado,
        setIsEvaluado,
        showAsignacionesModal,
        setShowAsignacionesModal,
        colaboradoresAsignados,
        poesAsignados,
        nuevoPoe,
        setNuevoPoe,
        handleAgregarPoe,
        handleSubmit
    } = useCapacitation();

    return (
        <FormContainer title="Registro de Capacitación" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <InputField
                    name="titulo"
                    label="Título capacitación:"
                    placeholder="Ingrese el título"
                    className="w-full"
                />
                <SelectField
                    name="procedimiento"
                    label="Procedimiento:"
                    className="w-full"
                    defaultValue=""
                />
                <SelectField
                    name="tipoCapacitacion"
                    label="Tipo capacitación:"
                    className="w-full"
                    defaultValue=""

                />
                <InputField
                    name="colaborador"
                    label="Colaborador:"
                    placeholder="Buscar colaborador"
                    className="w-full cursor-pointer bg-white"
                    readOnly
                    onClick={() => setShowColaboradorModal(true)}
                />
                <InputField
                    name="facilitador"
                    label="Facilitador:"
                    placeholder="Buscar facilitador"
                    className="w-full cursor-pointer bg-white"
                    readOnly
                    onClick={() => setShowFacilitadorModal(true)}
                />
                <InputField
                    name="fecha"
                    label="Fecha Inicio:"
                    type="date"
                    className="w-full"
                />
                <InputField
                    name="fechaFin"
                    label="Fecha Fin:"
                    type="date"
                    className="w-full"
                />
                <InputField
                    name="duracion"
                    label="Duración (horas):"
                    type="number"
                    min={1}
                    placeholder="Ingrese la duración"
                    className="w-full"
                />
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
                {isEvaluado && (
                    <SelectField
                        name="metodoEvaluacion"
                        label="Método de evaluación:"
                        className="w-full"
                        defaultValue=""
                        options={[
                            { value: "", label: "Seleccione...", disabled: true },
                            { value: "Teórico", label: "Teórico" },
                            { value: "Práctico", label: "Práctico" },
                            { value: "Campo", label: "Campo" },
                        ]}
                    />
                )}
            </div>
            <div className="flex justify-center mt-6 gap-4">
                <SubmitButton width="w-40">
                    Guardar
                </SubmitButton>
                <SubmitButton
                    onClick={() => setShowAsignacionesModal(true)}
                    width="w-40">
                    Progreso
                </SubmitButton>
            </div>
            {/* Modales */}
            {showColaboradorModal && (
                <SimpleModal
                    open={showColaboradorModal}
                    title="Seleccionar Colaborador"
                    onClose={() => setShowColaboradorModal(false)}
                    widthClass="min-w-[340px] max-w-md w-full"
                >
                    <InputField
                        name="buscarColaborador"
                        placeholder="Buscar por id, nombre"
                        className="w-full"
                    />
                    <div className="mt-6 mr-7 flex justify-center gap-3">
                        <SubmitButton>
                            Asignar
                        </SubmitButton>
                    </div>
                </SimpleModal>
            )}
            {showFacilitadorModal && (
                <SimpleModal
                    open={showFacilitadorModal}
                    title="Seleccionar Facilitador"
                    onClose={() => setShowFacilitadorModal(false)}
                    widthClass="min-w-[340px] max-w-md w-full"
                >
                    <InputField
                        name="buscarFacilitador"
                        placeholder="Buscar facilitador..."
                        className="w-full"
                    />
                    <div className="mt-6 mr-7 flex justify-center gap-3">
                        <SubmitButton>
                            Asignar
                        </SubmitButton>
                    </div>
                </SimpleModal>
            )}
            {showAsignacionesModal && (
                <SimpleModal
                    open={showAsignacionesModal}
                    title="Progreso"
                    onClose={() => setShowAsignacionesModal(false)}
                >
                    {/* Colaboradores asignados */}
                    <div className="mt-10 mb-6">
                        <h4 className="font-semibold text-[#15803D] mb-2">Colaboradores asignados:</h4>
                        <ul className="list-disc ml-6">
                            {colaboradoresAsignados.map((col, idx) => (
                                <li key={idx} className="text-[#222]">{col}</li>
                            ))}
                        </ul>
                    </div>
                    {/* POEs asignados */}
                    <div className="mb-4">
                        <h4 className="font-semibold text-[#15803D] mb-2">POE(s) asignados:</h4>
                        <ul className="list-disc ml-6 mb-2">
                            {poesAsignados.map((poe, idx) => (
                                <li key={idx} className="text-[#222]">{poe}</li>
                            ))}
                        </ul>
                        <div className="flex items-center gap-2 mb-2">
                            <SelectField
                                name="nuevoPoe"
                                className="w-full"
                                value={nuevoPoe}
                                onChange={e => setNuevoPoe(e.target.value)}
                            />
                            <SubmitButton onClick={handleAgregarPoe} type="button">
                                <span className="text-white">Agregar</span>
                            </SubmitButton>
                        </div>
                    </div>
                </SimpleModal>
            )}
        </FormContainer>
    );
};

export default Capacitacion;