import { usePendingTrainings } from "../../hooks/usePendingTrainings";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SelectField from "../../components/formComponents/SelectField";
import FullScreenSpinner from "../../components/globalComponents/FullScreenSpinner";

export default function PendingTrainingsScreen() {
    const {
        loading,
        areas,
        filtered,
        paginated,
        filterArea,
        setFilterArea,
        filterNombre,
        setFilterNombre,
        page,
        setPage,
        totalPages,
    } = usePendingTrainings();

    if (loading) {
        return <FullScreenSpinner />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fff] to-white px-0 py-4 rounded-xl shadow-lg transition-all duration-300 ease-in-out">
            <div className="max-w-6xl mx-auto px-4 pt-8 pb-2 mb-4">
                <div className="flex w-full justify-center mb-2">
                    <h1 className="text-4xl font-black text-[#2BAC67] text-center">
                        Pendientes de Capacitación
                    </h1>
                </div>
                <div className="flex w-full justify-end">
                    <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-xl shadow">
                        <PersonRoundedIcon className="text-green-600" fontSize="medium" />
                        <span className="font-bold text-green-800">{filtered.length}</span>
                        <span className="text-green-700 text-sm">Pendientes</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center mb-6">
                <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl bg-white rounded-xl shadow p-4 border border-green-100">
                    <div className="w-full md:w-1/2">
                        <input
                            type="text"
                            value={filterNombre}
                            onChange={e => setFilterNombre(e.target.value)}
                            className="w-full h-12 px-3 border border-[#2AAC67] rounded-lg text-[#2AAC67] focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-transparent"
                            placeholder="Buscar por nombre..."
                        />
                    </div>
                    <div className="w-full md:w-1/2">
                        <SelectField
                            name="filterArea"
                            label=""
                            value={filterArea}
                            onChange={e => setFilterArea(e.target.value)}
                            options={[
                                { value: "", label: "Todas las áreas" },
                                ...areas
                                    .filter(area => area.titulo && area.titulo.trim() !== "")
                                    .reduce((acc, area) => {
                                        if (!acc.some(a => a.value === area.titulo)) {
                                            acc.push({ value: area.titulo, label: area.titulo });
                                        }
                                        return acc;
                                    }, [] as { value: string; label: string }[]),
                            ]}
                            optionLabel="label"
                            optionValue="value"
                            className="h-12 px-3 py-0"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                {paginated.length === 0 ? (
                    <div className="col-span-full text-center text-gray-400 text-lg font-semibold">
                        No hay capacitaciones pendientes.
                    </div>
                ) : (
                    paginated.map((item, index) => (
                        <div
                            key={`${item.id_colaborador}-${item.id_documento}-${item.nombre_rol}-${index}`}
                            className="bg-white rounded-2xl shadow-xl border border-green-200 hover:shadow-2xl transition flex flex-col p-6 gap-4 relative"
                        >
                            <div className="flex items-center gap-4 mb-2">
                                <div>
                                    <div className="font-extrabold text-green-900 text-lg truncate">{item.nombre_completo}</div>
                                    <div className="text-green-700 text-xs">{item.puesto}</div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                                <span className="bg-green-100 px-2 py-1 rounded font-semibold">
                                    Área: <span className="font-normal">{item.area}</span>
                                </span>
                                <span className="bg-green-100 px-2 py-1 rounded font-semibold">
                                    Departamento: <span className="font-normal">{item.departamento}</span>
                                </span>
                                <span className="bg-green-100 px-2 py-1 rounded font-semibold">
                                    Rol: <span className="font-normal">{item.nombre_rol}</span>
                                </span>
                            </div>


                            <div className="text-green-800 font-semibold text-sm mt-2 truncate">{item.descripcion}</div>
                            <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-2">
                                <span className="bg-white border border-green-200 rounded px-2 py-1">
                                    <b>Código:</b> {item.codigo}
                                </span>
                                <span className="bg-white border border-green-200 rounded px-2 py-1">
                                    <b>Versión:</b> {item.version}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <nav className="flex justify-center items-center mt-12 gap-2 mb-6">

                <button
                    className={`w-28 h-10 rounded-lg border-2 font-bold flex items-center justify-center transition
                    ${page === 1
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : "bg-white text-[#2BAC67] border-[#2BAC67] hover:bg-[#2BAC67] hover:text-white"}
                    `}
                    onClick={() => {
                        if (page > 1) {
                            setPage(page - 1);
                        }
                    }}
                    disabled={page === 1}
                    aria-label="Anterior"
                >
                    {"‹ Anterior"}
                </button>

                <button
                    className={`w-28 h-10 rounded-lg border-2 font-bold flex items-center justify-center transition
                    ${page >= totalPages
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : "bg-white text-[#2BAC67] border-[#2BAC67] hover:bg-[#2BAC67] hover:text-white"}
                    `}
                    onClick={() => {
                        if (page < totalPages) {
                            setPage(page + 1);
                        }
                    }}
                    disabled={page >= totalPages}
                    aria-label="Siguiente"
                >
                    {"Siguiente ›"}
                </button>
            </nav>
        </div>
    );
}