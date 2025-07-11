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
    getPagination,
    firstLoad,
    handleCardClick,
    allCollaboratorsLength,
  } = useCollaboratorsPagination();

  if (loading && firstLoad.current) {
    return <FullScreenSpinner />;
  }

  return (
    <div className="p-2 sm:p-6 max-w-[1300px] mx-auto bg-white rounded-3xl shadow-2xl min-h-[90vh]">
      <h1 className="text-3xl font-bold text-[#2AAC67] text-center mb-6">
        Colaboradores
      </h1>

      <div className="mb-8 flex justify-center">
        <input
          type="text"
          className="w-full max-w-xl rounded-xl border border-[#2AAC67] shadow-md px-4 py-2 focus:outline-none focus:border-green-600 text-base"
          placeholder="Buscar por nombre o código"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {allCollaboratorsLength === 0 ? (
        <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-center">
          {searchTerm
            ? `No se encontraron colaboradores con "${searchTerm}"`
            : 'No hay colaboradores disponibles'}
        </div>
      ) : (
        <>
          <div
            className="
              grid
              gap-6
              mt-4
              pb-8
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
            "
          >
            {collaborators.map((colab) => (
              <CollaboratorCard
                key={colab.id_colaborador}
                id={colab.id_colaborador}
                nombre={`${colab.nombre} ${colab.apellido1} ${colab.apellido2}`}
                puesto={colab.puesto}
                onClick={handleCardClick}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <nav className="inline-flex space-x-2">
                {getPagination(totalPages, page).map((p, idx) =>
                  p === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-3 py-1 text-gray-400 select-none">...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(Number(p))}
                      className={`px-3 py-1 rounded-lg border ${
                        page === p
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-white text-green-700 border-green-200 hover:bg-green-50'
                      } transition`}
                    >
                      {p}
                    </button>
                  )
                )}
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Collaborators;