import React from "react";

const CapacitationGroupFinished: React.FC = () => {
  const rows = 7;
  const cols = 4;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="bg-[#f4fcec] border border-[#c0d95b] rounded-2xl p-6 w-full max-w-6xl shadow-lg overflow-x-auto">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#1a7f37]">
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
    </div>
  );
};

export default CapacitationGroupFinished;
