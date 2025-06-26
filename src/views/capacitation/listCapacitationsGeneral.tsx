import { Search, Person, Badge, Apartment, Work } from "@mui/icons-material";
import GlobalDataTable from '../../components/globalComponents/GlobalDataTable';
import FullScreenSpinner from '../../components/globalComponents/FullScreenSpinner';
import GlobalModal from '../../components/globalComponents/GlobalModal';
import { useCapacitationGeneralList } from '../../hooks/capacitations/useCapacitationGeneralList';


export default function ListCapacitationGeneral() {
  const {
    capacitations,
    searchTerm,
    setSearchTerm,
    showModal,
    setShowModal,
    selectedCapacitation,
    handleRowClick,
    isLoading,
  } = useCapacitationGeneralList();

  if (isLoading) return <FullScreenSpinner />;

  const columns = [
    {
      name: 'ID',
      selector: (row: any) => row.id,
      sortable: true,
      cell: (row: any) => <div className="text-sm font-medium text-gray-900">{row.id}</div>,
      wrap: true,
      width: '120px',
    },
    {
      name: 'TÍTULO',
      selector: (row: any) => row.titulo,
      sortable: true,
      cell: (row: any) => <div className="text-sm text-gray-700">{row.titulo}</div>,
      wrap: true,
    },
    {
      name: 'Fecha Creación',
      selector: (row: any) => row.fechaCreacion,
      sortable: true,
      cell: (row: any) => <div className="text-sm text-gray-700">{row.fechaCreacion}</div>,
      wrap: true,
    },

  ];
  return (
    <div className="p-4 bg-white rounded-lg">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 w-full border-b-2 border-[#2AAC67] pb-2">
          Generales
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-[#2AAC67] sm:text-sm"
            placeholder="Buscar por título o ID"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="border border-gray-200 rounded-lg overflow-x-auto">
        <GlobalDataTable
          columns={columns}
          data={capacitations}
          rowsPerPage={10}
          dense
          highlightOnHover
          noDataComponent={
            <div className="px-6 py-4 text-center text-sm text-gray-500">
              {isLoading ? "Cargando capacitaciones generales..." : "No se encontraron capacitaciones generales"}
            </div>
          }
          customStyles={{
            headCells: {
              style: {
                background: "#F0FFF4",
                color: "#2AAC67",
                fontWeight: "bold",
                fontSize: "13px",
                textTransform: "uppercase",
              },
            },
          }}
          onRowClicked={handleRowClick}
          progressPending={isLoading}
        />      </div>
      <GlobalModal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Detalles de Capacitación General"
        maxWidth="sm"
      >
        {selectedCapacitation && (
          <div>
            <h3 className="text-[#2ecc71] font-bold text-lg mb-4">Colaboradores Asignados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
              {selectedCapacitation.colaboradores.map((colaborador) => (
                <div key={colaborador.id} className="border border-[#2ecc71] rounded-lg p-3 bg-[#f6fff6]">
                  <div className="flex items-center mb-2">
                    <Person className="mr-2 text-[#2ecc71]" />
                    <span className="font-semibold text-[#2ecc71]">{colaborador.nombre}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      <Badge className="mr-2 text-[#2ecc71] text-sm" />
                      <span className="font-medium">Cédula:</span>
                      <span className="ml-1 text-gray-600">{colaborador.cedula}</span>
                    </div>
                    <div className="flex items-center">
                      <Work className="mr-2 text-[#2ecc71] text-sm" />
                      <span className="font-medium">Puesto:</span>
                      <span className="ml-1 text-gray-600">{colaborador.puesto}</span>
                    </div>
                    <div className="flex items-center">
                      <Apartment className="mr-2 text-[#2ecc71] text-sm" />
                      <span className="font-medium">Departamento:</span>
                      <span className="ml-1 text-gray-600">{colaborador.departamento}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </GlobalModal>
    </div>
  );
}