import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCollaborators from './useCollaborators';

const ITEMS_PER_PAGE = 9;

const getPagination = (totalPages: number, currentPage: number) => {
  const pages: (number | string)[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
  }
  return pages;
};

const useCollaboratorsPagination = () => {
  const navigate = useNavigate();
  const { collaborators, loading, error, searchTerm, setSearchTerm } = useCollaborators();
  const firstLoad = useRef(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (!loading) {
      firstLoad.current = false;
    }
  }, [loading]);

  const totalPages = Math.ceil(collaborators.length / ITEMS_PER_PAGE);
  const paginatedCollaborators = collaborators.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleCardClick = (id: string) => {
    navigate(`/collaborators/detail/${id}`);
  };

  return {
    collaborators: paginatedCollaborators,
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
    allCollaboratorsLength: collaborators.length,
  };
};

export default useCollaboratorsPagination;