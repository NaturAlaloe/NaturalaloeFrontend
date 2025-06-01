import React from "react";

const CapacitationIndividualFinished: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="bg-[#f4fcec] border-2 border-[#c0d95b] rounded-2xl p-6 w-full max-w-md shadow-md">
        {/* Nombre completo */}
        <div className="mb-6">
          <label className="block text-[#304328] font-semibold mb-1">
            Nombre Completo:
          </label>
          <div className="bg-white border border-[#9ccb13] text-[#304328] rounded-md px-3 py-2">
            Juan Díaz
          </div>
        </div>

        {/* Cédula */}
        <div className="mb-6">
          <label className="block text-[#304328] font-semibold mb-1">
            Ced:
          </label>
          <div className="bg-white border border-[#9ccb13] text-[#304328] rounded-md px-3 py-2">
            # 000000000
          </div>
        </div>

        {/* Nota */}
        <div>
          <label className="block text-[#304328] font-semibold mb-1">
            Nota:
          </label>
          <div className="bg-white border border-[#9ccb13] text-[#304328] rounded-md px-3 py-2">
            98
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapacitationIndividualFinished;
