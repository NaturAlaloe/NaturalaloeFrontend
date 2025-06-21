import { useState } from "react";
import { Search } from "@mui/icons-material";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import FormContainer from "../../components/formComponents/FormContainer";

interface Participante {
  id: number;
  nombre: string;
  nota: string;
  seguimiento: string;
  comentario: string;
}

const CalificarCapacitacionPage = () => {
  const [participantes, setParticipantes] = useState<Participante[]>([
    { id: 1, nombre: "Juan Pérez", nota: "", seguimiento: "", comentario: "" },
    { id: 2, nombre: "Ana Gómez", nota: "", seguimiento: "", comentario: "" },
    { id: 3, nombre: "Carlos Ramírez", nota: "", seguimiento: "", comentario: "" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const filtered = participantes.filter((p) =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginated = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  const handleNotaChange = (id: number, valor: string) => {
    setParticipantes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, nota: valor } : p))
    );
  };

  const handleSeguimientoChange = (id: number, valor: string) => {
    setParticipantes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, seguimiento: valor } : p))
    );
  };

  const handleComentarioChange = (id: number, valor: string) => {
    setParticipantes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, comentario: valor } : p))
    );
  };

  const handleGuardarTodos = () => {
    alert("Calificaciones y seguimientos guardados correctamente.");
    console.log("Datos guardados:", participantes);
  };

  const columns = [
    {
      name: "Nombre",
      selector: (row: Participante) => row.nombre,
      sortable: true,
    },
    {
      name: "Nota",
      cell: (row: Participante) => (
        <input
          type="number"
          value={row.nota}
          onChange={(e) => handleNotaChange(row.id, e.target.value)}
          className="w-20 border border-gray-300 rounded px-2 py-1 text-sm font-normal text-[#2AAC67]"
          min={0}
          max={100}
        />
      ),
    },
    {
      name: "Seguimiento",
      cell: (row: Participante) => (
        <select
          value={row.seguimiento}
          onChange={(e) => handleSeguimientoChange(row.id, e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm font-normal text-[#2AAC67]"
        >
          <option value="">Seleccione</option>
          <option value="satisfactorio">Satisfactorio</option>
          <option value="reprogramar">Reprogramar</option>
          <option value="reevaluacion">Reevaluación</option>
        </select>
      ),
    },
    {
      name: "Comentario",
      cell: (row: Participante) => (
        <textarea
          value={row.comentario}
          onChange={(e) => handleComentarioChange(row.id, e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm font-normal text-[#2AAC67] resize-none"
        />
      ),
    }
  ];

  const customStyles = {
    table: {
      style: {
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #E5E7EB',
      },
    },
    headRow: {
      style: {
        backgroundColor: '#F0FFF4',
        borderBottomWidth: '1px',
        borderBottomColor: '#E5E7EB',
      },
    },
    headCells: {
      style: {
        color: '#2AAC67',
        fontWeight: 'normal',
        textTransform: 'uppercase' as const,
        fontSize: '0.75rem',
        letterSpacing: '0.05em',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        fontFamily: 'inherit',
      },
    },
    cells: {
      style: {
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        fontWeight: 'normal',
        fontFamily: 'inherit',
        color: '#2AAC67',
      },
    },
    rows: {
      style: {
        '&:not(:last-of-type)': {
          borderBottomWidth: '1px',
          borderBottomColor: '#E5E7EB',
        },
        cursor: 'pointer',
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: '#F0FFF4',
          color: '#2AAC67',
        },
        '& input, & select, & button': {
          cursor: 'default',
          fontWeight: 'normal',
        },
      },
    },
    pagination: {
      style: {
        borderTopWidth: '1px',
        borderTopColor: '#E5E7EB',
      },
    },
  };

  const CustomPagination = () => (
    <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
      <p className="text-sm text-gray-700">
        Mostrando{' '}
        <span className="font-medium">{(currentPage - 1) * rowsPerPage + 1}</span> a{' '}
        <span className="font-medium">
          {Math.min(currentPage * rowsPerPage, filtered.length)}
        </span>{' '}
        de <span className="font-medium">{filtered.length}</span> resultados
      </p>
      <nav className="inline-flex rounded-md shadow-sm -space-x-px">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-2 py-2 border text-sm text-gray-500 bg-white hover:bg-gray-100 rounded-l-md"
        >
          ◀
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx + 1}
            onClick={() => setCurrentPage(idx + 1)}
            className={`px-4 py-2 border text-sm ${currentPage === idx + 1
                ? 'bg-gray-300 text-gray-900 font-bold'
                : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            {idx + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-2 py-2 border text-sm text-gray-500 bg-white hover:bg-gray-100 rounded-r-md"
        >
          ▶
        </button>
      </nav>
    </div>
  );

  return (
    <FormContainer title="Calificación de Capacitación">
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-[#2AAC67] sm:text-sm"
        />
      </div>

      <GlobalDataTable
        columns={columns}
        data={paginated}
        pagination={false}
        highlightOnHover={false}
        dense
        customStyles={customStyles}
      />

      <CustomPagination />

      <div className="flex justify-center mt-6">
        <button
          onClick={handleGuardarTodos}
          className="px-6 py-3 rounded-md bg-[#2AAC67] text-white font-semibold hover:bg-[#259e5d] transition"
        >
          Guardar calificaciones
        </button>
      </div>
    </FormContainer>
  );
};

export default CalificarCapacitacionPage;
