import TableContainer from "../../components/TableContainer";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import GlobalModal from "../../components/globalComponents/GlobalModal";
import SubmitButton from "../../components/formComponents/SubmitButton";
import InputField from "../../components/formComponents/InputField";
import SearchBar from "../../components/globalComponents/SearchBarTable";
import { Edit, Delete } from "@mui/icons-material";
import { useCategoriesList } from '../../hooks/manage/useCategoriesList';
import FullScreenSpinner from "../../components/globalComponents/FullScreenSpinner";
import { useState, useEffect } from "react";

export default function CategoriesList() {
    const ui = useCategoriesList();

    const [codigoInput, setCodigoInput] = useState<string>("");
    const [page, setPage] = useState(1); // nuevo estado

    useEffect(() => {
        if (ui.editCategoryObj) {
            setCodigoInput(ui.editCategoryObj.numero_categoria || "");
        } else {
            setCodigoInput("");
        }
    }, [ui.editCategoryObj, ui.modalOpen]);

    // Resetear página cuando cambia el filtro
    useEffect(() => {
        setPage(1);
    }, [ui.search]);

    const columns = [
        {
            name: "Código",
            selector: (row: { numero_categoria: string }) => row.numero_categoria,
            sortable: true,
        },
        {
            name: "Categoría",
            selector: (row: { nombre_categoria: string }) => row.nombre_categoria,
            sortable: true,
        },
        {
            name: "Acciones",
            cell: (row: any) => (
                <div className="flex gap-2">
                    <button
                        className="text-[#2AAC67] hover:text-green-700"
                        onClick={() => ui.handleOpenEdit(row)}
                        title="Editar"
                    >
                        <Edit fontSize="small" />
                    </button>
                    <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => ui.handleOpenDelete(row)}
                        title="Eliminar"
                    >
                        <Delete fontSize="small" />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    return (
        <TableContainer title="Categorías">
            {ui.loading && <FullScreenSpinner />}
            <div className="flex items-center justify-between mb-4">
                <SearchBar
                    value={ui.search}
                    onChange={(value: string) => ui.setSearch(value)}
                    placeholder="Buscar categoría..."
                    className="w-full mr-4"
                />
                <SubmitButton
                    className="px-3 py-2 text-base rounded-lg flex items-center justify-center"
                    width="w-10"
                    type="button"
                    onClick={ui.handleOpenAdd}
                    style={{ minWidth: "40px", minHeight: "40px", padding: 0 }}
                >
                    <span className="text-xl leading-none">+</span>
                </SubmitButton>
            </div>
            <GlobalDataTable
                columns={columns}
                data={ui.filteredCategories}
                rowsPerPage={5}
                progressPending={ui.loading}
                pagination
                paginationDefaultPage={page}
                onChangePage={setPage}
            />

            <GlobalModal
                open={ui.modalOpen}
                onClose={() => {
                    ui.setModalOpen(false);
                    ui.setEditCategoryObj(null);
                }}
                title={ui.editCategoryObj ? "Editar Categoría" : "Agregar Categoría"}
                maxWidth="sm"
            >
                <form
                    onSubmit={(e) => ui.handleSave(e, codigoInput)}
                    className="flex flex-col gap-4 min-w-[250px]"
                >
                    <InputField
                        label="Código"
                        name="codigo"
                        value={codigoInput}
                        onChange={(e) => setCodigoInput(e.target.value)}
                        required
                    />
                    <InputField
                        label="Nombre de la Categoría"
                        name="categoria"
                        value={ui.categoryInput}
                        onChange={(e) => ui.setCategoryInput(e.target.value)}
                        required
                    />

                    <SubmitButton>
                        {ui.editCategoryObj ? "Guardar Cambios" : "Agregar"}
                    </SubmitButton>
                </form>
            </GlobalModal>

            <GlobalModal
                open={ui.deleteCategoryObj !== null}
                onClose={() => ui.setDeleteCategoryObj(null)}
                title="Eliminar Categoría"
                maxWidth="sm"
                actions={
                    <div className="flex gap-2">
                        <SubmitButton
                            className="bg-gray-400 hover:bg-gray-500"
                            type="button"
                            onClick={() => ui.setDeleteCategoryObj(null)}
                        >
                            Cancelar
                        </SubmitButton>
                        <SubmitButton
                            className="bg-red-500 hover:bg-red-600"
                            type="button"
                            onClick={ui.handleDelete}
                        >
                            Eliminar
                        </SubmitButton>
                    </div>
                }
            >
                <div>¿Estás seguro de que deseas eliminar esta categoría?</div>
            </GlobalModal>
            {ui.error && (
                <div className="text-red-500 mt-2 text-center">{ui.error}</div>
            )}
        </TableContainer>
    );
}