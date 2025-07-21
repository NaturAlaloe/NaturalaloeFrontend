import { motion } from "framer-motion";
import { createPortal } from "react-dom";

interface TokenExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TokenExpiredModal({ isOpen, onClose }: TokenExpiredModalProps) {
  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="bg-[#DEF7E9] fixed inset-0 flex items-center justify-center z-[9999]"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl border border-gray-200"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Sesión Expirada
          </h3>
          <p className="text-gray-600 mb-6">
            Tu sesión ha expirado. Por favor, inicia sesión nuevamente para continuar.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-[#2AAC67] text-white py-2 px-4 rounded-lg hover:bg-[#238A56] transition-colors font-medium"
          >
            Entendido
          </button>
        </div>
      </motion.div>
    </div>
  );

  // Renderizar el modal en el body usando portal
  return createPortal(modalContent, document.body);
}