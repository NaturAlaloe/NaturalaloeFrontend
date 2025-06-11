import { useAddFacilitator } from '../../hooks/capacitations/useAddFacilitator';

const AgregarFacilitadores = () => {
  const {
    step,
    nombre,
    tipo,
    profesorNombre,
    profesorApellido,
    profesorId,
    setNombre,
    setTipo,
    setProfesorNombre,
    setProfesorApellido,
    setProfesorId,
    handleNext,
    handleBack,
    handleGuardar,
  } = useAddFacilitator();

  return (
    <div className="min-h-screen  flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md border border-[white]">
        <div className="flex flex-col items-center mb-8">
          <div className="flex gap-4 mb-4">

          </div>
          <h2 className="text-2xl font-extrabold text-green-700 mb-1">
            {step === 1 ? 'Nuevo Facilitador' : 'Profesor responsable'}
          </h2>
          <p className="text-gray-500 text-sm">
            {step === 1
              ? 'Registra un Nuevo Facilitador para la capacitación'
              : 'Ingresa los datos del profesor que realizará la capacitación'}
          </p>
        </div>

        {step === 1 && (
          <form className="space-y-6" onSubmit={handleNext}>
            <div>
              <label className="block text-sm font-semibold text-green-700 mb-1">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Nombre del Instructor"
                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-green-700 mb-1">Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50 transition"
                required
              >
                <option value="" disabled>Seleccione</option>
                <option value="Interno">Interno</option>
                <option value="Externo">Externo</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-2.5 rounded-lg font-bold shadow-md hover:from-green-600 hover:to-green-800 transition"
            >
              Siguiente
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="space-y-6" onSubmit={handleGuardar}>
            {tipo === "Interno" ? (
              <div>
                <label className="block text-sm font-semibold text-green-700 mb-1">Opciones</label>
                <select
                  className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50 transition"
                  required
                >
                  <option value="">(Opciones internas aquí)</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-green-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={profesorNombre}
                  onChange={(e) => setProfesorNombre(e.target.value)}
                  placeholder="Nombre del profesor"
                  className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50 transition"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-green-700 mb-1">Apellido</label>
              <input
                type="text"
                value={profesorApellido}
                onChange={(e) => setProfesorApellido(e.target.value)}
                placeholder="Apellido del profesor"
                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-green-700 mb-1">Identificación</label>
              <input
                type="text"
                value={profesorId}
                onChange={(e) => setProfesorId(e.target.value)}
                placeholder="Identificación"
                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50 transition"
                required
              />
            </div>
            <div className="flex justify-between gap-2">
              <button
                type="button"
                onClick={handleBack}
                className="w-1/2 bg-gray-200 text-green-700 py-2.5 rounded-lg font-bold shadow-md hover:bg-gray-300 transition"
              >
                Volver
              </button>
              <button
                type="submit"
                className="w-1/2 bg-gradient-to-r from-green-500 to-green-700 text-white py-2.5 rounded-lg font-bold shadow-md hover:from-green-600 hover:to-green-800 transition"
              >
                Guardar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AgregarFacilitadores;
