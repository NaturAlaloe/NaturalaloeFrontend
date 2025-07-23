import { useState, useEffect } from "react";
import useGetUsers from "../../hooks/users/useGetUsers";
import type { User } from "../../services/users/getUsersService";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import { Edit, Delete, Search } from "@mui/icons-material";
import GlobalModal from "../../components/globalComponents/GlobalModal";
import InputField from "../../components/formComponents/InputField";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";
import { deleteUser } from "../../services/users/deleteUserService";
import { useEditUser } from "../../hooks/users/useUpdateUser";

export default function ViewUsers() {
    const [deleting, setDeleting] = useState(false);

    const { users, loading, error, fetchUsers } = useGetUsers();
    const [searchTerm, setSearchTerm] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const [editableData, setEditableData] = useState({
        nombre: "",
        apellido1: "",
        apellido2: "",
        email: "",
    });

    const { handleEditUser, loading: editLoading } = useEditUser();

    useEffect(() => {
        if (selectedUser) {
            setEditableData({
                nombre: selectedUser.nombre,
                apellido1: selectedUser.apellido1,
                apellido2: selectedUser.apellido2,
                email: selectedUser.email,
            });
        }
    }, [selectedUser]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditableData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = async () => {
        if (!selectedUser) return;
        const dataToUpdate = {
            userId: selectedUser.id_usuario,
            nombre: editableData.nombre,
            apellido1: editableData.apellido1,
            apellido2: editableData.apellido2,
            email: editableData.email,
        };
        const result = await handleEditUser(dataToUpdate);
        if (result) {
            showCustomToast("Éxito", "Usuario actualizado correctamente.", "success");
            setModalOpen(false);
            setSelectedUser(null);
            fetchUsers();
        }
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;
        setDeleting(true);
        try {
            await deleteUser({ id_usuario: userToDelete.id_usuario });
            showCustomToast("Éxito", "Usuario eliminado correctamente.", "success");
        } catch (error) {
            showCustomToast("Error", "No se pudo eliminar el usuario.", "error");
        }
        setDeleting(false);
        setDeleteModalOpen(false);
        setUserToDelete(null);
        fetchUsers();
    };


    const filteredUsers = users.filter((user) => {
        const s = searchTerm.toLowerCase();
        return (
            (user.nombre || "").toLowerCase().includes(s) ||
            (user.apellido1 || "").toLowerCase().includes(s) ||
            (user.apellido2 || "").toLowerCase().includes(s) ||
            (user.email || "").toLowerCase().includes(s) ||
            user.id_usuario.toString().includes(s)
        );
    });

    const columns = [
        { name: "ID", selector: (row: User) => row.id_usuario },
        {
            name: "Nombre",
            selector: (row: User) => `${row.nombre} ${row.apellido1} ${row.apellido2}`
        },
        { name: "Correo", selector: (row: User) => row.email },
        {
            name: "Acciones",
            cell: (row: User) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setSelectedUser(row);
                            setModalOpen(true);
                        }}
                        className="text-green-600 hover:text-green-800"
                    >
                        <Edit fontSize="small" />
                    </button>
                    <button
                        onClick={() => {
                            setUserToDelete(row);
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
                Usuarios Registrados
            </h1>

            {loading ? (
                <div className="flex justify-center py-10">
                    <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-[#2AAC67] rounded-full" />
                </div>
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <strong>Error al cargar los usuarios:</strong> {error}
                </div>
            ) : (
                <>
                    <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <Search className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar usuarios..."
                            className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-[#2AAC67] focus:border-[#2AAC67] sm:text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <GlobalDataTable
                        columns={columns}
                        data={filteredUsers}
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
                        noDataComponent="No hay usuarios registrados"
                    />

                    {selectedUser && (
                        <GlobalModal
                            open={modalOpen}
                            onClose={() => {
                                setModalOpen(false);
                                setSelectedUser(null);
                            }}
                            title="Editar Usuario"
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
                                        {editLoading ? "Editando..." : "Guardar Cambios"}
                                    </button>

                                </div>
                            }
                        >
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        name="email"
                                        type="email"
                                        value={editableData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </GlobalModal>
                    )}

                    {userToDelete && (
                        <GlobalModal
                            open={deleteModalOpen}
                            onClose={() => {
                                setDeleteModalOpen(false);
                                setUserToDelete(null);
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
                                        disabled={deleting}
                                    >
                                        {deleting ? "Eliminando..." : "Eliminar"}
                                    </button>

                                </div>
                            }
                        >
                            <div className="text-center">
                                <p className="text-gray-700 mb-4">
                                    ¿Está seguro que desea eliminar permanentemente al usuario?
                                </p>
                                <p className="font-semibold">
                                    {userToDelete.nombre} {userToDelete.apellido1} {userToDelete.apellido2}
                                </p>
                                <p className="text-sm text-gray-500">Correo: {userToDelete.email}</p>
                            </div>
                        </GlobalModal>
                    )}
                </>
            )}
        </div>
    );
}
