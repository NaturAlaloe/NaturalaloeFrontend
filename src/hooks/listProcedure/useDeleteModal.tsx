import GlobalModal from "../../components/globalComponents/GlobalModal";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function useDeleteModal() {
  const DeleteModal = ({ isOpen, onClose, onConfirm }: DeleteModalProps) => (
    <GlobalModal
      open={isOpen}
      onClose={onClose}
      title="Confirmar eliminación"
    >
      <div className="p-4 text-center">
        <p className="text-sm text-gray-700 mb-4">
          ¿Está seguro que desea eliminar este procedimiento?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </GlobalModal>
  );

  return { DeleteModal };
}
