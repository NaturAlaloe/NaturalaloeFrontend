import { useState, useEffect, useCallback } from 'react';
import type { ICollaborator } from '../../services/manage/collaboratorService';
import { getCollaborators } from '../../services/manage/collaboratorService';

const useCollaborators = () => {
  const [collaborators, setCollaborators] = useState<ICollaborator[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCollaborators = useCallback(async (term: string) => {
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
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, fetchCollaborators]);

  // Filtrado en frontend si searchTerm existe
  const filteredCollaborators = searchTerm
    ? collaborators.filter(colab =>
        (
          `${colab.nombre || ''} ${colab.apellido1 || ''} ${colab.apellido2 || ''}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        ) ||
        String(colab.id_colaborador || '').includes(searchTerm) ||
        (colab.puesto || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    : collaborators;

  return { 
    collaborators: filteredCollaborators, 
    loading, 
    error, 
    searchTerm, 
    setSearchTerm 
  };
};

export default useCollaborators;