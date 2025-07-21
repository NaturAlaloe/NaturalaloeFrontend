import { useState, useEffect, useCallback } from 'react';
import type { ICollaborator } from '../../services/manage/collaboratorService';
import { getCollaborators } from '../../services/manage/collaboratorService';


//hook utilizado para manejar la búsqueda y filtrado de colaboradores para la pantalla de asignación de roles a los colaboradores

const useCollaborators = () => {
  const [collaborators, setCollaborators] = useState<ICollaborator[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCollaborators = useCallback(async (term: string) => {
    if (!term.trim()) {
      setCollaborators([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await getCollaborators(term);
      setCollaborators(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Error al cargar colaboradores');
      setCollaborators([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCollaborators(searchTerm);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchTerm, fetchCollaborators]);

  // Filtrado local que incluye búsqueda por cédula
  const filteredCollaborators = searchTerm.trim()
    ? collaborators.filter(colab => {
        const searchLower = searchTerm.toLowerCase().trim();
        const nombreCompleto = `${colab.nombre || ''} ${colab.apellido1 || ''} ${colab.apellido2 || ''}`.toLowerCase();
        const cedula = (colab.cedula || '').toString().toLowerCase();
        const puesto = (colab.puesto || '').toLowerCase();
        
        return nombreCompleto.includes(searchLower) ||
               cedula.includes(searchLower) ||
               puesto.includes(searchLower);
      })
    : [];

  return { 
    collaborators: filteredCollaborators, 
    loading, 
    error, 
    searchTerm, 
    setSearchTerm 
  };
};

export default useCollaborators;