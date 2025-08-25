import React from 'react';
import CollaboratorCard from '../../components/globalComponents/CollaboratorCard';
import FullScreenSpinner from '../../components/globalComponents/FullScreenSpinner';
import useCollaboratorsPagination from '../../hooks/collaborator/useCollaboratorsPagination';

const Collaborators: React.FC = () => {
  const {
    collaborators,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    totalPages,
    firstLoad,
    handleCardClick,
    allCollaboratorsLength,
  } = useCollaboratorsPagination();

  if (loading && firstLoad.current) {
    return <FullScreenSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff] to-white px-0 py-4 rounded-xl shadow-lg transition-all duration-300 ease-in-out">
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-2 mb-4">
        <div className="flex w-full justify-center mb-2">
          <h1 className="text-4xl font-black text-[#2BAC67] text-center font-[Poppins]">
            Colaboradores
          </h1>
        </div>
      </div>

      <div className="flex flex-col items-center mb-6">
        <div className="flex w-full max-w-2xl bg-white rounded-xl shadow p-4 border border-green-100">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // <-- Esto asegura que siempre vuelve a la página 1 al filtrar
            }}
            className="w-full h-12 px-3 border border-[#2AAC67] rounded-lg text-[#2AAC67] focus:outline-none focus:ring-2 focus:ring-[#2AAC67] focus:border-transparent"
            placeholder="Buscar por nombre o código..."
          />
        </div>
      </div>

      {error && (
        <div className="max-w-6xl mx-auto mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mx-4">
          {error}
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {allCollaboratorsLength === 0 ? (
          <div className="col-span-full text-center text-gray-400 text-lg font-semibold">
            {searchTerm
              ? `No se encontraron colaboradores con "${searchTerm}"`
              : 'No hay colaboradores disponibles'}
          </div>
        ) : (
          collaborators.map((colab) => (
            <CollaboratorCard
              key={colab.id_colaborador}
              id={colab.id_colaborador}
              cedula={colab.cedula}
              nombre={`${colab.nombre} ${colab.apellido1} ${colab.apellido2}`}
              puesto={colab.puesto}
              onClick={handleCardClick}
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <nav className="flex justify-center items-center mt-12 gap-2 mb-6">
          <button
            className={`w-28 h-10 rounded-lg border-2 font-bold flex items-center justify-center transition
              ${page === 1
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-[#2BAC67] border-[#2BAC67] hover:bg-[#2BAC67] hover:text-white"}
            `}
            onClick={() => {
              if (page > 1) {
                setPage(page - 1);
              }
            }}
            disabled={page === 1}
            aria-label="Anterior"
          >
            {"‹ Anterior"}
          </button>

          <button
            className={`w-28 h-10 rounded-lg border-2 font-bold flex items-center justify-center transition
              ${page >= totalPages
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-[#2BAC67] border-[#2BAC67] hover:bg-[#2BAC67] hover:text-white"}
            `}
            onClick={() => {
              if (page < totalPages) {
                setPage(page + 1);
              }
            }}
            disabled={page >= totalPages}
            aria-label="Siguiente"
          >
            {"Siguiente ›"}
          </button>
        </nav>
      )}
    </div>
  );
};

export default Collaborators;