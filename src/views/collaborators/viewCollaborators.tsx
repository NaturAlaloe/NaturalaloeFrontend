import { useState } from "react";
import useGetCollaborators from "../../hooks/collaborator/useGetCollaborators";
import type { Collaborator } from "../../services/collaborators/getCollaboratorsService";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import { Edit, Delete, Search } from "@mui/icons-material";

export default function ViewCollaborators() {
    const { collaborators, loading, error } = useGetCollaborators();
    const [searchTerm, setSearchTerm] = useState("");

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
        { name: "ID", selector: (row: Collaborator) => row.id_colaborador },
        { name: "Nombre", selector: (row: Collaborator) => `${row.nombre} ${row.apellido1} ${row.apellido2}` },
        { name: "Puesto", selector: (row: Collaborator) => row.puesto },
        { name: "Correo", selector: (row: Collaborator) => row.correo },
        { name: "Teléfono", selector: (row: Collaborator) => row.numero },
        { name: "Nacimiento", selector: (row: Collaborator) => new Date(row.fecha_nacimiento).toLocaleDateString() },
        {
            name: "Acciones", cell: (row: Collaborator) => (
                <div className="flex gap-2">

                    {/*LÓGICA EDITAR */}
                    <button onClick={() => console.log("Editar", row.id_colaborador)}>
                        <Edit fontSize="small" className="text-green-600" />
                    </button>
                    {/*LÓGICA ELIMINAR */}
                    <button onClick={() => console.log("Eliminar", row.id_colaborador)}>
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
                </>
            )}
        </div>
    );
}
