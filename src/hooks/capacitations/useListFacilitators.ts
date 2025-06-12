import { useState } from 'react';

export interface Facilitador {
  id: number;
  nombre: string;
  apellido: string;
  tipo: string;
}

const datosFacilitadores: Facilitador[] = [
  { id: 1, nombre: 'Ana', apellido: 'Gómez', tipo: 'Interno' },
  { id: 2, nombre: 'Luis', apellido: 'Pérez', tipo: 'Externo' },
  { id: 3, nombre: 'Marta', apellido: 'Rodríguez', tipo: 'Interno' },
  { id: 4, nombre: 'Carlos', apellido: 'Ramírez', tipo: 'Externo' },
];

export const useFacilitadoresList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const normalizeText = (text: string) =>
    text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  const filtered = datosFacilitadores.filter((f) => {
    const fullText = `${f.nombre} ${f.apellido} ${f.tipo}`;
    return normalizeText(fullText).includes(normalizeText(searchTerm));
  });

  const paginated = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  return {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    filtered,
    paginated,
    totalPages,
  };
};
