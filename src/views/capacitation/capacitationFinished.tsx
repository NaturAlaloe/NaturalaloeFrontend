import React from "react";
import { useCapacitationFinished } from '../../hooks/capacitations/useCapacitationFinished';


const CapacitationFinished: React.FC = () => {
  const { step, setStep, rows, cols } = useCapacitationFinished();

  return (
    <div className="mt-10 bg-white flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-3xl border border-green-700">
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

            {["Nombre completo", "Cédula", "Nota", "Fecha fin de tutoría"].map((label, idx) => (
              <div key={idx} className="mb-4">
                <label className="text-sm font-medium mb-1 block text-[#1a7f37]">
                  {label}:
                </label>
                <div
                  className="bg-white border rounded-lg px-4 py-2 min-h-[2.5rem] text-[#1a7f37]"
                  style={{ borderColor: "#c0d95b" }}
                >
                  {/* Aquí puedes poner el dato correspondiente */}
                </div>
              </div>
            ))}
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
                    {["Nombre Completo", "Cédula", "Nota", "Fecha fin de tutoría"].map(
                      (text, idx) => {
                        let borderStyle = "border border-[#c0d95b]";
                        if (idx === 0) borderStyle = "border-t-0 border-l-0 border-[#c0d95b]";
                        if (idx === cols - 1) borderStyle = "border-t-0 border-r-0 border-[#c0d95b]";
                        return (
                          <th
                            key={idx}
                            className={`${borderStyle} px-4 py-3 font-semibold`}
                          >
                            {text}
                          </th>
                        );
                      }
                    )}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(rows)].map((_, rowIdx) => (
                    <tr
                      key={rowIdx}
                      className={rowIdx % 2 === 0 ? "bg-white" : "bg-[#f9fff2] hover:bg-[#ecfae0]"}
                    >
                      {[...Array(cols)].map((_, colIdx) => {
                        let borderStyle = "border border-[#d4e7b3]";
                        if (rowIdx === rows - 1 && colIdx === 0)
                          borderStyle = "border-b-0 border-l-0 border-[#d4e7b3]";
                        if (rowIdx === rows - 1 && colIdx === cols - 1)
                          borderStyle = "border-b-0 border-r-0 border-[#d4e7b3]";
                        return (
                          <td
                            key={colIdx}
                            className={`${borderStyle} px-4 py-3 text-[#304328]`}
                          ></td>
                        );
                      })}
                    </tr>
                  ))}
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
