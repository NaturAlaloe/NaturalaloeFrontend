import { useState, useEffect } from "react";
import useGetCollaborators from "../../hooks/collaborator/useGetCollaborators";
import type { Collaborator } from "../../services/collaborators/getCollaboratorsService";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import { Edit, Delete, Search } from "@mui/icons-material";
import GlobalModal from "../../components/globalComponents/GlobalModal";
import { useEditCollaborator } from "../../hooks/collaborators/useEditCollaborator";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";
import { deleteCollaborator } from "../../services/collaborators/deleteCollaboratorService";
import InputField from "../../components/formComponents/InputField";

export default function ViewCollaborators() {
    const { collaborators, loading, error, fetchCollaborators } = useGetCollaborators();
    const [searchTerm, setSearchTerm] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | null>(null);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [collaboratorToDelete, setCollaboratorToDelete] = useState<Collaborator | null>(null);

    const [editableData, setEditableData] = useState({
        correo: "",
        numero: ""
    });

    const { handleEditCollaborator, loading: editLoading } = useEditCollaborator();

    useEffect(() => {
        if (selectedCollaborator) {
            setEditableData({
                correo: selectedCollaborator.correo,
                numero: selectedCollaborator.numero
            });
        }
    }, [selectedCollaborator]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditableData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = async () => {
        if (!selectedCollaborator) return;
        const result = await handleEditCollaborator({
            id_colaborador: selectedCollaborator.id_colaborador,
            correo: editableData.correo,
            numero: editableData.numero,
        });
        if (result) {
            showCustomToast("Éxito", "Colaborador actualizado correctamente.", "success");
            setModalOpen(false);
            setSelectedCollaborator(null);
            fetchCollaborators();
        }
    };

    const handleConfirmDelete = async () => {
        if (!collaboratorToDelete) return;
        await deleteCollaborator({ id_colaborador: collaboratorToDelete.id_colaborador });
        setDeleteModalOpen(false);
        setCollaboratorToDelete(null);
        showCustomToast("Éxito", "Colaborador eliminado correctamente.", "success");
        fetchCollaborators();
    };

    const filtered = collaborators.filter((col) => {
        const s = searchTerm.toLowerCase();
        return (
            col.id_colaborador.toString().includes(s) ||
            `${col.nombre} ${col.apellido1} ${col.apellido2}`.toLowerCase().includes(s) ||
            col.puesto?.toLowerCase().includes(s) ||
            col.correo.toLowerCase().includes(s) ||
            col.numero.toLowerCase().includes(s) ||
            new Date(col.fecha_nacimiento).toLocaleDateString().toLowerCase().includes(s)
        );
    });

    const columns = [
        { name: "Cédula", selector: (row: Collaborator) => row.id_colaborador },
        {
            name: "Nombre",
            selector: (row: Collaborator) => `${row.nombre} ${row.apellido1} ${row.apellido2}`
        },
        { name: "Puesto", selector: (row: Collaborator) => row.puesto },
        { name: "Correo", selector: (row: Collaborator) => row.correo },
        { name: "Teléfono", selector: (row: Collaborator) => row.numero },
        {
            name: "Nacimiento",
            selector: (row: Collaborator) => new Date(row.fecha_nacimiento).toLocaleDateString()
        },
        {
            name: "Acciones",
            cell: (row: Collaborator) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setSelectedCollaborator(row);
                            setModalOpen(true);
                        }}
                    >
                        <Edit fontSize="small" className="text-green-600" />
                    </button>
                    <button
                        onClick={() => {
                            setCollaboratorToDelete(row);
                            setDeleteModalOpen(true);
                        }}
                    >
                        <Delete fontSize="small" className="text-red-600" />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            button: true,
        },
    ];

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-[#2AAC67] pb-2">
                Colaboradores de la Empresa
            </h1>

            {loading ? (
                <div className="flex justify-center py-10">
                    <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-[#2AAC67] rounded-full" />
                </div>
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <strong>Error al cargar los colaboradores:</strong> {error}
                </div>
            ) : (
                <>
                    <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <Search className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar colaboradores..."
                            className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-[#2AAC67] focus:border-[#2AAC67] sm:text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <GlobalDataTable
                        columns={columns}
                        data={filtered}
                        pagination
                        highlightOnHover
                        pointerOnHover
                        paginationComponentOptions={{
                            rowsPerPageText: "Filas por página",
                            rangeSeparatorText: "de",
                            noRowsContent: "No hay colaboradores.",
                        }}
                    />

                    {selectedCollaborator && (
                        <GlobalModal
                            open={modalOpen}
                            onClose={() => {
                                setModalOpen(false);
                                setSelectedCollaborator(null);
                            }}
                            title="Editar Colaborador"
                            actions={
                                <button
                                    onClick={handleSaveChanges}
                                    className="bg-[#2AAC67] text-white px-4 py-2 rounded"
                                    disabled={editLoading}
                                >
                                    {editLoading ? "Guardando..." : "Guardar Cambios"}
                                </button>}>
                            <div>
                                <div className="mb-5 text-center text-xl">
                                    Nombre: {selectedCollaborator.nombre} {selectedCollaborator.apellido1} {selectedCollaborator.apellido2}
                                </div>

                                <div className="mb-5 text-center text-xl">
                                    Cédula: {selectedCollaborator.id_colaborador}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Correo</label>
                                        <InputField
                                            name="correo"
                                            type="email"
                                            value={editableData.correo}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full p-2 border rounded-md focus:ring-[#2AAC67] focus:border-[#2AAC67] sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                                        <InputField
                                            name="numero"
                                            type="text"
                                            value={editableData.numero}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full p-2 border rounded-md focus:ring-[#2AAC67] focus:border-[#2AAC67] sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </GlobalModal>
                    )}

                    {collaboratorToDelete && (
                        <GlobalModal
                            open={deleteModalOpen}
                            onClose={() => {
                                setDeleteModalOpen(false);
                                setCollaboratorToDelete(null);
                            }}
                            title="Eliminar Colaborador"
                            actions={
                                <div className="flex gap-2">
                                    <button onClick={handleConfirmDelete} className="bg-red-600 text-white px-4 py-2 rounded">
                                        Confirmar
                                    </button>
                                    <button
                                        onClick={() => {
                                            setDeleteModalOpen(false);
                                            setCollaboratorToDelete(null);
                                        }}
                                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            }
                        >
                            <div className="text-center text-lg">
                                ¿Está seguro que desea eliminar el usuario <span className="font-bold">{collaboratorToDelete.nombre} {collaboratorToDelete.apellido1} {collaboratorToDelete.apellido2}</span> con la cédula <span className="font-bold">{collaboratorToDelete.id_colaborador}</span>?
                            </div>
                        </GlobalModal>
                    )}
                </>
            )}
        </div>
    );
}