import AssignmentIcon from "@mui/icons-material/Assignment";
import { useCapacitation } from "../../hooks/capacitations/useCapacitation";

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
        poesDisponibles,
        handleAgregarPoe,
    } = useCapacitation();

    return (
        <div className="mt-13 flex items-center justify-center">
            <div className="bg-white border-2 border-[white] rounded-2xl shadow-lg max-w-3xl w-full px-8 py-8">
                <div className="flex items-center justify-center mb-8 gap-3">
                    <AssignmentIcon sx={{ color: "#15803D", fontSize: 36 }} />
                    <h2 className="text-[#15803D] font-bold text-2xl m-0">
                        Registro de Capacitación
                    </h2>
                </div>
                <form>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <label className="font-semibold text-[#2ecc71]">Título capacitación:</label>
                            <input
                                type="text"
                                placeholder="Ingrese el título"
                                className="w-full mt-1 px-4 py-2 border-2 border-gray-300 rounded-lg outline-none text-base text-[#222]"
                            />
                        </div>
                        <div>
                            <label className="font-semibold text-[#2ecc71]">Procedimineto(POE):</label>
                            <select className="w-full mt-1 px-4 py-2 border-2 border-gray-300 rounded-lg outline-none text-base text-[#222]">
                                <option value="" disabled selected>Seleccione...</option>
                                <option>700-50-001 - Nombre Procedimiento</option>
                                <option>500-53-002 - Nombre Procedimiento</option>
                                <option>600-40-003 - Nombre Procedimiento</option>
                            </select>
                        </div>
                        <div>
                            <label className="font-semibold text-[#2ecc71]">Tipo capacitación:</label>
                            <select className="w-full mt-1 px-4 py-2 border-2 border-gray-300 rounded-lg outline-none text-base text-[#222]">
                                <option value="" disabled selected>Seleccione...</option>
                                <option>Interna</option>
                                <option>Externa</option>
                            </select>
                        </div>
                        <div>
                            <label className="font-semibold text-[#2ecc71]">Colaborador:</label>
                            <input
                                type="text"
                                placeholder="Buscar colaborador"
                                className="w-full mt-1 px-4 py-2 border-2 border-gray-300 rounded-lg outline-none text-base text-[#222] cursor-pointer bg-white"
                                readOnly
                                onClick={() => setShowColaboradorModal(true)}
                            />
                        </div>
                        <div>
                            <label className="font-semibold text-[#2ecc71]">Facilitador:</label>
                            <input
                                type="text"
                                placeholder="Buscar facilitador"
                                className="w-full mt-1 px-4 py-2 border-2 border-gray-300 rounded-lg outline-none text-base text-[#222] cursor-pointer bg-white"
                                readOnly
                                onClick={() => setShowFacilitadorModal(true)}
                            />
                        </div>
                        <div>
                            <label className="font-semibold text-[#2ecc71]">Fecha Inicio:</label>
                            <input type="date" className="w-full mt-1 px-4 py-2 border-2 border-gray-300 rounded-lg outline-none text-base text-[#222]" />
                        </div>
                        <div>
                            <label className="font-semibold text-[#2ecc71]">Fecha Fin:</label>
                            <input type="date" className="w-full mt-1 px-4 py-2 border-2 border-gray-300 rounded-lg outline-none text-base text-[#222]" />
                        </div>
                        <div>
                            <label className="font-semibold text-[#2ecc71]">Duración (horas):</label>
                            <input
                                type="number"
                                min="1"
                                placeholder="Ingrese la duración"
                                className="w-full mt-1 px-4 py-2 border-2 border-gray-300 rounded-lg outline-none text-base text-[#222]"
                            />
                        </div>
                        <div>
                            <label className="font-semibold text-[#2ecc71]">Seguimiento:</label>
                            <select className="w-full mt-1 px-4 py-2 border-2 border-gray-300 rounded-lg outline-none text-base text-[#222]">
                                <option value="" disabled selected>Seleccione...</option>
                                <option>Satisfactorio</option>
                                <option>Reprogramar</option>
                                <option>Reevaluación</option>
                            </select>
                        </div>
                        <div className="flex items-center mt-7">
                            <input
                                type="checkbox"
                                id="evaluado"
                                className="accent-[#2ecc71] mr-2 w-5 h-5"
                                checked={isEvaluado}
                                onChange={() => setIsEvaluado(!isEvaluado)}
                            />
                            <label htmlFor="evaluado" className="font-semibold text-[#2ecc71]">Es Evaluado:</label>
                        </div>
                        {isEvaluado && (
                            <div>
                                <label className="font-semibold text-[#2ecc71]">Método de evaluación:</label>
                                <select className="w-full mt-1 px-4 py-2 border-2 border-gray-300 rounded-lg outline-none text-base text-[#222]">
                                    <option>Seleccione...</option>
                                    <option>Teórico</option>
                                    <option>Práctico</option>
                                    <option>Campo</option>
                                </select>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-center mt-6 gap-4">
                        <button
                            type="button"
                            className="bg-[#15803D] text-white font-bold rounded-full px-12 py-3 text-lg shadow-md hover:bg-[#27ae60] transition"
                        >
                            Guardar
                        </button>
                        <button
                            type="button"
                            className="bg-[#15803D] text-white font-bold rounded-full px-12 py-3 text-lg shadow-md hover:bg-[#14532d] transition"
                            onClick={() => setShowAsignacionesModal(true)}
                        >
                            Progreso
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal Colaborador */}
            {showColaboradorModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: "blur(4px)", backgroundColor: "rgba(0,0,0,0.2)" }}>
                    <div className="bg-white rounded-xl p-8 min-w-[340px] shadow-lg">
                        <h3 className="text-[#2ecc71] font-bold text-lg mb-4">Seleccionar Colaborador:</h3>
                        <input
                            type="text"
                            placeholder="Buscar por id, nombre"
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg outline-none text-base text-[#222]"
                        />
                        <div className="mt-6 mr-7 flex justify-end gap-3">
                            <button
                                onClick={() => setShowColaboradorModal(false)}
                                className="bg-[#2ecc71] text-white rounded-lg px-6 py-2 font-semibold hover:bg-[#27ae60] transition"
                            >
                                Cerrar
                            </button>
                            <button

                                className="bg-[#2ecc71] text-white rounded-lg px-6 py-2 font-semibold hover:bg-[#27ae60] transition"
                            >
                                Asignar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Facilitador */}
            {showFacilitadorModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: "blur(4px)", backgroundColor: "rgba(0,0,0,0.2)" }}>
                    <div
                        className="bg-white p-8 min-w-[340px] shadow-lg"
                        style={{
                            borderRadius: "0.75rem",
                        }}
                    >
                        <h3 className="text-[#2ecc71] font-bold text-lg mb-4">Seleccionar Facilitador</h3>
                        <input
                            type="text"
                            placeholder="Buscar facilitador..."
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg outline-none text-base text-[#222]"
                        />
                        <div className="mt-6 mr-7 flex justify-end gap-3">
                            <button
                                onClick={() => setShowFacilitadorModal(false)}
                                className="bg-[#2ecc71] text-white rounded-lg px-6 py-2 font-semibold hover:bg-[#27ae60] transition"
                            >
                                Cerrar
                            </button>
                            <button

                                className="bg-[#2ecc71] text-white rounded-lg px-6 py-2 font-semibold hover:bg-[#27ae60] transition"
                            >
                                Asignar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Asignaciones */}
            {showAsignacionesModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: "blur(4px)", backgroundColor: "rgba(0,0,0,0.2)" }}>
                    <div className="bg-white rounded-xl p-8 min-w-[400px] shadow-lg max-w-lg w-full">
                        <h3 className="text-[#2ecc71] font-bold text-lg mb-4">Asignaciones</h3>
                        {/* Colaboradores asignados */}
                        <div className="mb-6">
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
                                <select
                                    className="border-2 border-gray-300 rounded-lg px-3 py-2 text-base text-[#222]"
                                    value={nuevoPoe}
                                    onChange={e => setNuevoPoe(e.target.value)}
                                >
                                    <option value="">Seleccione POE...</option>
                                    {poesDisponibles
                                        .filter(poe => !poesAsignados.includes(poe))
                                        .map((poe, idx) => (
                                            <option key={idx} value={poe}>{poe}</option>
                                        ))}
                                </select>
                                <button
                                    type="button"
                                    className="bg-[#2ecc71] text-white rounded-lg px-4 py-2 font-semibold hover:bg-[#27ae60] transition"
                                    onClick={handleAgregarPoe}
                                >
                                    Agregar
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setShowAsignacionesModal(false)}
                                className="bg-[#2ecc71] text-white rounded-lg px-6 py-2 font-semibold hover:bg-[#27ae60] transition"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Capacitacion;