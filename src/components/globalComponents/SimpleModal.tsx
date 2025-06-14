import React from "react";

interface ModalWithHeaderProps {
    open: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    widthClass?: string; // Ejemplo: "min-w-[400px] max-w-lg w-full"
}

const ModalWithHeader: React.FC<ModalWithHeaderProps> = ({
    open,
    title,
    onClose,
    children,
    widthClass = "min-w-[400px] max-w-lg w-full",
}) => {
    if (!open) return null;
    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{
                backdropFilter: "blur(4px)",
                backgroundColor: "rgba(0,0,0,0.2)",
            }}
        >
            <div className={`bg-white rounded-xl p-8 shadow-lg relative ${widthClass}`}>
                {/* Encabezado con título y botón X */}
                <div className="flex items-center justify-center gap-4 mb-2">
                    <p className="text-2xl font-bold text-[#2AAC67] text-center flex-1">{title}</p>
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-[#2AAC67] hover:text-[#15803D] text-2xl font-bold focus:outline-none"
                        aria-label="Cerrar"
                        type="button"
                    >
                        &times;
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default ModalWithHeader;