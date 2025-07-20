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
        cedula: "",
        nombre: "",
        apellido1: "",
        apellido2: "",
        correo: "",
        numero: ""
    });

    const { handleEditCollaborator, loading: editLoading } = useEditCollaborator();

    useEffect(() => {
        if (selectedCollaborator) {
            setEditableData({
                nombre: selectedCollaborator.nombre,
                apellido1: selectedCollaborator.apellido1,
                apellido2: selectedCollaborator.apellido2,
                correo: selectedCollaborator.correo,
                numero: selectedCollaborator.numero,
                cedula: selectedCollaborator.cedula
            });
        }
    }, [selectedCollaborator]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditableData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = async () => {
        if (!selectedCollaborator) return;
        const dataToUpdate = {
            id_colaborador: selectedCollaborator.id_colaborador,
            cedula: editableData.cedula,
            nombre: editableData.nombre,
            apellido1: editableData.apellido1,
            apellido2: editableData.apellido2,
            correo: editableData.correo,
            numero: editableData.numero,
        };
        const result = await handleEditCollaborator(dataToUpdate);
        if (result) {
            showCustomToast("Éxito", "Colaborador actualizado correctamente.", "success");
            setModalOpen(false);
            setSelectedCollaborator(null);
            fetchCollaborators();
        }
    };

    const handleConfirmDelete = async () => {
        if (!collaboratorToDelete) return;
        try {
            await deleteCollaborator({ id_colaborador: collaboratorToDelete.id_colaborador });
            showCustomToast("Éxito", "Colaborador eliminado correctamente.", "success");
        } catch (error) {
            showCustomToast("Error", "No se pudo eliminar el colaborador.", "error");
        }
        setDeleteModalOpen(false);
        setCollaboratorToDelete(null);
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
        { name: "Cédula", selector: (row: Collaborator) => row.cedula },
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
                        className="text-green-600 hover:text-green-800"
                    >
                        <Edit fontSize="small" />
                    </button>
                    <button
                        onClick={() => {
                            setCollaboratorToDelete(row);
                            setDeleteModalOpen(true);
                        }}
                        className="text-red-600 hover:text-red-800"
                    >
                        <Delete fontSize="small" />
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
                            noRowsPerPage: false,
                            selectAllRowsItem: false,
                            selectAllRowsItemText: "Todos",
                        }}
                        noDataComponent="No hay colaboradores registrados"
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
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setModalOpen(false)}
                                        className="px-4 py-2 text-gray-600 rounded hover:bg-gray-100"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSaveChanges}
                                        className="bg-[#2AAC67] text-white px-4 py-2 rounded hover:bg-[#218c54]"
                                        disabled={editLoading}
                                    >
                                        {editLoading ? "Guardando..." : "Guardar Cambios"}
                                    </button>
                                </div>
                            }
                        >
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField
                                        label="Cédula"
                                        name="cedula"
                                        value={editableData.cedula}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <InputField
                                        label="Nombre"
                                        name="nombre"
                                        value={editableData.nombre}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <InputField
                                        label="Primer Apellido"
                                        name="apellido1"
                                        value={editableData.apellido1}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <InputField
                                        label="Segundo Apellido"
                                        name="apellido2"
                                        value={editableData.apellido2}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <InputField
                                        label="Correo Electrónico"
                                        name="correo"
                                        type="email"
                                        value={editableData.correo}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <InputField
                                        label="Teléfono"
                                        name="numero"
                                        value={editableData.numero}
                                        onChange={handleInputChange}
                                        required
                                    />
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
                            title="Confirmar Eliminación"
                            actions={
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setDeleteModalOpen(false)}
                                        className="px-4 py-2 text-gray-600 rounded hover:bg-gray-100"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleConfirmDelete}
                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            }
                        >
                            <div className="text-center">
                                <p className="text-gray-700 mb-4">
                                    ¿Está seguro que desea eliminar permanentemente al colaborador?
                                </p>
                                <p className="font-semibold">
                                    {collaboratorToDelete.nombre} {collaboratorToDelete.apellido1} {collaboratorToDelete.apellido2}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Cédula: {collaboratorToDelete.cedula}
                                </p>
                            </div>
                        </GlobalModal>
                    )}
                </>
            )}
        </div>
    );
}