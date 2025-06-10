import React, { useState } from "react";

interface SelectModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  placeholder: string;
  onAssign: (value: string) => void;
}

const SelectModal: React.FC<SelectModalProps> = ({
  open,
  onClose,
  title,
  placeholder,
  onAssign,
}) => {
  const [value, setValue] = useState("");
  return (
    open && (
      <div
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
      >
        <div className="bg-white rounded-xl p-8 min-w-[340px] shadow-lg">
          <h3 className="text-[#2ecc71] font-bold text-lg mb-4">{title}</h3>
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-4 py-2 border-2 border-[#2ecc71] rounded-lg outline-none text-base text-[#222]"
          />
          <div className="mt-6 mr-7 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="bg-[#2ecc71] text-white rounded-lg px-6 py-2 font-semibold hover:bg-[#27ae60] transition"
            >
              Cerrar
            </button>
            <button
              onClick={() =>
                onAssign(
                  value ||
                    (title.includes("Colaborador")
                      ? "Juan Pérez"
                      : "María Facilitadora")
                )
              }
              className="bg-[#2ecc71] text-white rounded-lg px-6 py-2 font-semibold hover:bg-[#27ae60] transition"
            >
              Asignar
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default SelectModal;