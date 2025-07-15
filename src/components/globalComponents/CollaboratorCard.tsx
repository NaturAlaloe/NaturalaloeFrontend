import React from 'react';
import PersonIcon from '@mui/icons-material/Person';

interface CollaboratorCardProps {
  id: string;
  nombre: string;
  puesto?: string;
  onClick: (id: string) => void;
}

const CollaboratorCard: React.FC<CollaboratorCardProps> = ({ id, nombre, puesto, onClick }) => (
  <div
    onClick={() => onClick(id)}
    className="bg-white rounded-2xl shadow-lg border border-green-100 hover:shadow-xl hover:border-green-300 transition-all duration-300 cursor-pointer flex flex-col p-6 gap-4 relative group hover:scale-105"
  >
    {/* Header with Avatar */}
    <div className="flex items-center gap-4 mb-3">
      <div className="w-10 h-10 bg-[#2AAC66] rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
        <PersonIcon className="text-white" fontSize="medium" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-gray-800 text-lg truncate group-hover:text-green-700 transition-colors">
          {nombre}
        </div>
        {puesto && (
          <div className="text-gray-500 text-sm font-medium truncate">
            {puesto}
          </div>
        )}
      </div>
    </div>

    {/* ID Badge */}
    <div className="flex justify-between items-center">
      <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
       
        ID: {id}
      </span>
      
      {/* Action indicator */}
      <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-green-50 transition-colors">
        <svg 
          className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>

    {/* Hover effect overlay */}
  </div>
);

export default CollaboratorCard;