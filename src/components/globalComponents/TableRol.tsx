import React, { useState, useMemo } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';

interface TableRolProps {
  roles: string[];
  rolesSeleccionados: string[];
  loadingRoles: boolean;
  errorRoles: string | null;
  puestoSeleccionado: string;
  onSeleccionRol: (rol: string) => void;
}

const rolesPorPagina = 7;

const TableRol: React.FC<TableRolProps> = ({
  roles,
  rolesSeleccionados,
  loadingRoles,
  errorRoles,
  puestoSeleccionado,
  onSeleccionRol,
}) => {
  const [search, setSearch] = useState('');
  const [pagina, setPagina] = useState(0);

  // Filtrar roles por búsqueda
  const filteredRoles = useMemo(
    () =>
      roles.filter((rol) =>
        rol.toLowerCase().includes(search.trim().toLowerCase())
      ),
    [roles, search]
  );

  // Roles a mostrar en la página actual
  const paginatedRoles = useMemo(
    () =>
      filteredRoles.slice(
        pagina * rolesPorPagina,
        pagina * rolesPorPagina + rolesPorPagina
      ),
    [filteredRoles, pagina]
  );

  // Si cambias el filtro, vuelve a la página 0
  React.useEffect(() => {
    setPagina(0);
  }, [search]);

  return (
    <>
      {/* Buscador de roles */}
      <TextField
        variant="outlined"
        size="small"
        placeholder="Buscar rol..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#2AAC67' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 2,
          width: '100%',
          background: '#F6FBF7',
          borderRadius: 2,
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#2AAC67', borderRadius: 10 },
            '&:hover fieldset': { borderColor: 'black' },
            '&.Mui-focused fieldset': { borderColor: 'black' },
          },
        }}
      />

      <TableContainer component={Paper} sx={{ mb: 3, border: '1px solid #2AAC67', borderRadius: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#2AAC67', fontWeight: 'bold', letterSpacing: '0.5px', p: 1 }}>
                Rol
              </TableCell>
              <TableCell sx={{ color: '#2AAC67', fontWeight: 'bold', letterSpacing: '0.5px', p: 1 }}>
                Seleccionar
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingRoles ? (
              <TableRow>
                <TableCell colSpan={2} sx={{ textAlign: 'center', py: 2 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : errorRoles ? (
              <TableRow>
                <TableCell colSpan={2} sx={{ textAlign: 'center', py: 2, color: '#d32f2f' }}>
                  {errorRoles}
                </TableCell>
              </TableRow>
            ) : paginatedRoles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} sx={{ textAlign: 'center', py: 2, color: '#888' }}>
                  No hay roles disponibles
                </TableCell>
              </TableRow>
            ) : (
              paginatedRoles.map((rol) => (
                <TableRow
                  key={rol}
                  sx={{
                    transition: 'background-color 0.3s ease',
                    '&:hover': { backgroundColor: '#F0F8F2' },
                    py: 0.5,
                  }}
                >
                  <TableCell sx={{ p: 1 }}>{rol}</TableCell>
                  <TableCell sx={{ p: 1 }}>
                    <Checkbox
                      checked={rolesSeleccionados.includes(rol)}
                      onChange={() => onSeleccionRol(rol)}
                      disabled={rol === puestoSeleccionado}
                      sx={{ color: '#2AAC67', '&.Mui-checked': { color: '#2AAC67' }, p: 0.5 }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredRoles.length}
        rowsPerPage={rolesPorPagina}
        page={pagina}
        onPageChange={(_, newPage) => setPagina(newPage)}
        labelDisplayedRows={({ count }) => `Página ${pagina + 1} de ${Math.max(1, Math.ceil(count / rolesPorPagina))}`}
        rowsPerPageOptions={[]}
        sx={{ color: '#2AAC67' }}
      />
    </>
  );
};

export default TableRol;