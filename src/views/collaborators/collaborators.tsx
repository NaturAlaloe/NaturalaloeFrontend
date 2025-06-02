import React from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

const collaborators = [
  { id: 1, name: "Ana Gómez", code: "001" },
  { id: 2, name: "Luis Pérez", code: "002" },
  { id: 3, name: "Carlos Mora", code: "003" },
  { id: 4, name: "María López", code: "004" },
  { id: 5, name: "Pedro Ruiz", code: "005" },
  { id: 6, name: "Lucía Ramírez", code: "006" },
];

const Collaborators: React.FC = () => {
  const navigate = useNavigate();

  const handleCardClick = () => {
  navigate("/collaborators/detail"); // Navegación directa sin ID
  };

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold text-center mb-6">Colaboradores</h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Buscar..."
          className="px-4 py-2 rounded-lg border border-gray-300 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {collaborators.map((colab) => (
          <div
            key={colab.id}
            onClick={handleCardClick} // Todas las cards usan la misma función
            className="cursor-pointer bg-white border border-gray-200 rounded-xl shadow p-4 flex flex-col items-center hover:shadow-lg transition"
          >
            <div className="bg-gray-200 rounded-full p-4 mb-3">
              <User className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="font-semibold text-lg">{colab.name}</h3>
            <p className="text-sm text-gray-500">Código: {colab.code}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collaborators;