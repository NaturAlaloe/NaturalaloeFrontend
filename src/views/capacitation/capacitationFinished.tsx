import { useCapacitationFinished } from '../../hooks/capacitations/useCapacitationFinished';


const CapacitationFinished: React.FC = () => {
  const { step, setStep } = useCapacitationFinished();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e6f7ea]">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-3xl border border-[white]">
        <div className="flex justify-center mb-8 gap-4">
          <button
            className={`px-6 py-2 rounded-lg font-bold shadow-md transition ${step === 1
              ? "bg-gradient-to-r from-green-500 to-green-700 text-white"
              : "bg-gray-200 text-green-700 hover:bg-gray-300"
              }`}
            onClick={() => setStep(1)}
          >
            Capacitación Individual
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-bold shadow-md transition ${step === 2
              ? "bg-gradient-to-r from-green-500 to-green-700 text-white"
              : "bg-gray-200 text-green-700 hover:bg-gray-300"
              }`}
            onClick={() => setStep(2)}
          >
            Capacitación Grupal
          </button>
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-semibold text-center mb-6 text-[#1a7f37]">
              Capacitación Individual
            </h2>

            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block text-[#1a7f37]">
                Nombre completo:
              </label>
              <div className="bg-white border border-[#c0d95b] rounded-lg px-4 py-2 min-h-[2.5rem] text-[#1a7f37]">
                Juan Pérez
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block text-[#1a7f37]">
                Nota:
              </label>
              <div className="bg-white border border-[#c0d95b] rounded-lg px-4 py-2 min-h-[2.5rem] text-[#1a7f37]">
                95
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-semibold text-center mb-6 text-[#1a7f37]">
              Capacitación Grupal
            </h2>
            <div className="overflow-x-auto">
              <table
                className="w-full table-fixed text-sm border-separate border-spacing-0 rounded-xl overflow-hidden"
                style={{ border: "1px solid #c0d95b" }}
              >
                <thead>
                  <tr className="bg-[#e7f5d9] text-left text-[#1a7f37]">
                    {["Nombre Completo", "Nota"].map((text, idx) => {
                      let borderStyle = "border border-[#c0d95b]";
                      if (idx === 0) borderStyle = "border-t-0 border-l-0 border-[#c0d95b]";
                      if (idx === 1) borderStyle = "border-t-0 border-r-0 border-[#c0d95b]";
                      return (
                        <th
                          key={idx}
                          className={`${borderStyle} px-4 py-3 font-semibold`}
                        >
                          {text}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {/* Datos quemados para visualizar */}
                  <tr className="bg-white">
                    <td className="border border-[#d4e7b3] px-4 py-3 text-[#304328]">Ana Gómez</td>
                    <td className="border border-[#d4e7b3] px-4 py-3 text-[#304328]">90</td>
                  </tr>
                  <tr className="bg-[#f9fff2] hover:bg-[#ecfae0]">
                    <td className="border border-[#d4e7b3] px-4 py-3 text-[#304328]">Luis Martínez</td>
                    <td className="border border-[#d4e7b3] px-4 py-3 text-[#304328]">85</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-[#d4e7b3] px-4 py-3 text-[#304328]">María López</td>
                    <td className="border border-[#d4e7b3] px-4 py-3 text-[#304328]">98</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CapacitationFinished;
