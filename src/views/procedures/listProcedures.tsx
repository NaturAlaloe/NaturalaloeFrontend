import TableContainer from "../../components/TableContainer";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import SearchBar from "../../components/globalComponents/SearchBarTable";
import FullScreenSpinner from "../../components/globalComponents/FullScreenSpinner";
import CustomToaster, {
  showCustomToast,
} from "../../components/globalComponents/CustomToaster";

// Hooks
import { useListProceduresController } from "../../hooks/listProcedure/useListProceduresController";
import { useTableColumns } from "../../hooks/listProcedure/useTableColumns";

export default function ListProcedures() {
  const controller = useListProceduresController();
  
  const columns = useTableColumns({
    onViewDetails: controller.handleViewDetails,
    onEdit: controller.handleEdit,
    onDelete: controller.handleDelete,
  });

  if (controller.loading) return <FullScreenSpinner />;
  if (controller.error) {
    showCustomToast("Error al cargar procedimientos", controller.error, "error");
    return null;
  }

  return (
    <>
      <CustomToaster />
      <TableContainer title="Procedimientos de la Empresa">
        <div className="mb-4">
          <SearchBar
            value={controller.searchTerm}
            onChange={controller.setSearchTerm}
            placeholder="Buscar procedimientos por título o revisión..."
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Departamento
          </label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-[#2AAC67]"
            value={controller.departmentFilter}
            onChange={(e) => controller.setDepartmentFilter(e.target.value)}
          >
            <option value="">Todos los departamentos</option>
            {controller.departments.map((dept: string) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
        <GlobalDataTable
          columns={columns}
          data={controller.procedures}
          highlightOnHover
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 25, 50, 100]}
          noDataComponent={
            <div className="p-4 text-center text-gray-500">
              No se encontraron procedimientos
            </div>
          }
        />

        {/* Renderizar modales */}
        <controller.modals.editModal.component {...controller.modals.editModal.props} />
        <controller.modals.deleteModal.component {...controller.modals.deleteModal.props} />
        <controller.modals.detailsModal.component {...controller.modals.detailsModal.props} />
      </TableContainer>
    </>
  );
}
