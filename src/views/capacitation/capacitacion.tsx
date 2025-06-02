import AssignmentIcon from "@mui/icons-material/Assignment";
import { useState } from 'react';

const Capacitacion = () => {
    const [showColaboradorModal, setShowColaboradorModal] = useState(false);
    const [showFacilitadorModal, setShowFacilitadorModal] = useState(false);
    const [isEvaluado, setIsEvaluado] = useState(false);

    return (
        <div className=" mt-13 flex items-center justify-center bg-[#f6fff6]">
            <div className="bg-white border-2 border-[#2ecc71] rounded-2xl shadow-lg max-w-3xl w-full px-8 py-8">
                <div className="flex items-center justify-center mb-8 gap-3">
                    <AssignmentIcon sx={{ color: "#2ecc71", fontSize: 36 }} />
                    <h2 className="text-[#2ecc71] font-bold text-2xl m-0">
                        Registro de Capacitación
                    </h2>
                </div>
                <form>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <label className="font-semibold text-[#2ecc71]">Fecha Inicio</label>
                            <input type="date" className="w-full mt-1 px-4 py-2 border-2 border-[#2ecc71] rounded-lg outline-none text-base text-[#222]" />
                        </div>
                        <div>
                            <label className="font-semibold text-[#2ecc71]">Fecha Fin</label>
                            <input type="date" className="w-full mt-1 px-4 py-2 border-2 border-[#2ecc71] rounded-lg outline-none text-base text-[#222]" />
                        </div>
                        <div>
                            <label className="font-semibold text-[#2ecc71]">Tipo capacitación</label>
                            <select className="w-full mt-1 px-4 py-2 border-2 border-[#2ecc71] rounded-lg outline-none text-base text-[#222]">
                                <option>Seleccione...</option>
                                <option>Interna</option>
                                <option>Externa</option>
                            </select>
                        </div>
                        <div>
                            <label className="font-semibold text-[#2ecc71]">Colaborador</label>
                            <input
                                type="text"
                                placeholder="Seleccione colaborador"
                                className="w-full mt-1 px-4 py-2 border-2 border-[#2ecc71] rounded-lg outline-none text-base text-[#222] cursor-pointer bg-white"
                                readOnly
                                onClick={() => setShowColaboradorModal(true)}
                            />
                        </div>
                        <div>
                            <label className="font-semibold text-[#2ecc71]">Facilitador</label>
                            <input
                                type="text"
                                placeholder="Seleccione facilitador"
                                className="w-full mt-1 px-4 py-2 border-2 border-[#2ecc71] rounded-lg outline-none text-base text-[#222] cursor-pointer bg-white"
                                readOnly
                                onClick={() => setShowFacilitadorModal(true)}
                            />
                        </div>
                        <div className="flex items-center mt-7">
                            <input
                                type="checkbox"
                                id="evaluado"
                                className="accent-[#2ecc71] mr-2 w-5 h-5"
                                checked={isEvaluado}
                                onChange={() => setIsEvaluado(!isEvaluado)}
                            />
                            <label htmlFor="evaluado" className="font-semibold text-[#2ecc71]">Es Evaluado</label>
                        </div>
                        {isEvaluado && (
                            <div>
                                <label className="font-semibold text-[#2ecc71]">Método de evaluación</label>
                                <select className="w-full mt-1 px-4 py-2 border-2 border-[#2ecc71] rounded-lg outline-none text-base text-[#222]">
                                    <option>Seleccione...</option>
                                    <option>Teórico</option>
                                    <option>Práctico</option>
                                    <option>Campo</option>
                                </select>
                            </div>
                        )}
                        <div>
                            <label className="font-semibold text-[#2ecc71]">Seguimiento</label>
                            <select className="w-full mt-1 px-4 py-2 border-2 border-[#2ecc71] rounded-lg outline-none text-base text-[#222]">
                                <option>Seleccione...</option>
                                <option>Satisfactorio</option>
                                <option>Reprogramar</option>
                                <option>Reevaluación</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-center mt-6">
                        <button
                            type="button"
                            className="bg-[#2ecc71] text-white font-bold rounded-full px-12 py-3 text-lg shadow-md hover:bg-[#27ae60] transition"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal Colaborador */}
            {showColaboradorModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: "blur(4px)", backgroundColor: "rgba(0,0,0,0.2)" }}>
                    <div className="bg-white rounded-xl p-8 min-w-[340px] shadow-lg">
                        <h3 className="text-[#2ecc71] font-bold text-lg mb-4">Seleccionar Colaborador</h3>
                        <input
                            type="text"
                            placeholder="Buscar colaborador..."
                            className="w-full px-4 py-2 border-2 border-[#2ecc71] rounded-lg outline-none text-base text-[#222]"
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
                            className="w-full px-4 py-2 border-2 border-[#2ecc71] rounded-lg outline-none text-base text-[#222]"
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
        </div>
    );
};

export default Capacitacion;