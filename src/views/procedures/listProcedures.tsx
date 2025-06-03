import { useProceduresList, type Procedure } from "../../hooks/listProcedure/useProceduresList";
import { Search } from "@mui/icons-material";

export default function ListProcedures() {
  const {
    procedures,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    handleSort,
    departmentFilter,
    setDepartmentFilter,
    departments,
  } = useProceduresList();

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#2AAC67] pb-2">
        Procedimientos de la Empresa
      </h1>
      
      {/* Barra de búsqueda */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-[#2AAC67] sm:text-sm"
          placeholder="Buscar procedimientos por código o título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filtro de departamento */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
        <select
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-[#2AAC67]"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="">Todos los departamentos</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla de procedimientos */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#F0FFF4]"> {/* Fondo verde claro */}
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-[#2AAC67] uppercase tracking-wider"
              >
                POE
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-[#2AAC67] uppercase tracking-wider"
              >
                TÍTULO
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-[#2AAC67] uppercase tracking-wider"
              >
                DEPARTAMENTO
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-[#2AAC67] uppercase tracking-wider"
              >
                RESPONSABLE
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-[#2AAC67] uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("revision")}
              >
                <div className="flex items-center">
                  REVISIÓN
                  {sortField === "revision" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-[#2AAC67] uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("fecha")}
              >
                <div className="flex items-center">
                  FECHA
                  {sortField === "fecha" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {procedures.length > 0 ? (
              procedures.map((procedure) => (
                <tr key={procedure.poe} className="hover:bg-[#F0FFF4]">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {procedure.poe}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {procedure.titulo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {procedure.departamento}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {procedure.responsable}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {procedure.revision}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {procedure.fecha}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No se encontraron procedimientos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
