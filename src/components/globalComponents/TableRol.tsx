import React from 'react';
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
//import Alert from '@mui/material/Alert';

interface TableRolProps {
  roles: string[];
  rolesSeleccionados: string[];
  loadingRoles: boolean;
  errorRoles: string | null;
  puestoSeleccionado: string;
  onSeleccionRol: (rol: string) => void;
  pagina: number;
  rolesPorPagina: number;
  totalRoles: number;
  onPageChange: (event: unknown, newPage: number) => void;
}

const TableRol: React.FC<TableRolProps> = ({
  roles,
  rolesSeleccionados,
  loadingRoles,
  errorRoles,
  puestoSeleccionado,
  onSeleccionRol,
  pagina,
  rolesPorPagina,
  totalRoles,
  onPageChange,
}) => (
  <>
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
          ) : roles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} sx={{ textAlign: 'center', py: 2, color: '#888' }}>
                No hay roles disponibles
              </TableCell>
            </TableRow>
          ) : (
            roles.map((rol) => (
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
      count={totalRoles}
      rowsPerPage={rolesPorPagina}
      page={pagina}
      onPageChange={onPageChange}
      labelDisplayedRows={({ count }) => `Página ${pagina + 1} de ${Math.ceil(count / rolesPorPagina)}`}
      rowsPerPageOptions={[]}
      sx={{ color: '#2AAC67' }}
    />
  </>
);

export default TableRol;