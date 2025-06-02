import React from "react";

const CapacitationIndividualFinished: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="bg-[#f4fcec] border-2 border-[#c0d95b] rounded-2xl p-6 w-full max-w-md shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-[#1a7f37]">
          Capacitación Individual
        </h2>

        {/* Nombre completo */}
        <div className="mb-4">
          <label className="text-sm font-medium mb-1 block text-[#1a7f37]">
            Nombre completo:
          </label>
          <div
            className="bg-white border rounded-lg px-4 py-2 min-h-[2.5rem] text-[#1a7f37]"
            style={{ borderColor: "#c0d95b" }}
          />
        </div>

        {/* Cédula */}
        <div className="mb-4">
          <label className="text-sm font-medium mb-1 block text-[#1a7f37]">
            Cédula:
          </label>
          <div
            className="bg-white border rounded-lg px-4 py-2 min-h-[2.5rem] text-[#1a7f37]"
            style={{ borderColor: "#c0d95b" }}
          />
        </div>

        {/* Nota */}
        <div className="mb-4">
          <label className="text-sm font-medium mb-1 block text-[#1a7f37]">
            Nota:
          </label>
          <div
            className="bg-white border rounded-lg px-4 py-2 min-h-[2.5rem] text-[#1a7f37]"
            style={{ borderColor: "#c0d95b" }}
          />
        </div>

        {/* Fecha fin de tutoría */}
        <div className="mb-2">
          <label className="text-sm font-medium mb-1 block text-[#1a7f37]">
            Fecha fin de tutoría:
          </label>
          <div
            className="bg-white border rounded-lg px-4 py-2 min-h-[2.5rem] text-[#1a7f37]"
            style={{ borderColor: "#c0d95b" }}
          />
        </div>
      </div>
    </div>
  );
};

export default CapacitationIndividualFinished;
