import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import WorkIcon from '@mui/icons-material/Work';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const roles = [
  "Operador de Lavandería",
  "Técnico de Electricidad",
  "Asistente de Laboratorio",
  "Asistente Contable",
  "Auxiliar de Bodega",
  "Operario de Molino",
  "Operador de Montacargas y Tractorista",
  "Destilador",
  "Operario PVA",
  "Jardinero"
];

// Datos de ejemplo para cada rol
const poePorRol: Record<string, Array<any>> = {
  "Operador de Lavandería": [
    { poe: "01-01", descripcion: "Uso correcto de maquinaria", version: 2, fecha: "01/03/2024", estado: true },
    { poe: "01-02", descripcion: "Limpieza y seguridad", version: 1, fecha: "15/03/2024", estado: false }
  ],
  "Técnico de Electricidad": [
    { poe: "02-01", descripcion: "Manejo de tableros", version: 3, fecha: "10/02/2024", estado: true }
  ],
  // ...agrega datos de ejemplo para los demás roles si lo deseas...
};

export default function CollaboratorRolesList() {
  const [open, setOpen] = React.useState<Record<string, boolean>>({});

  const handleClick = (role: string) => {
    setOpen((prev) => ({ ...prev, [role]: !prev[role] }));
  };

  return (
    <List
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: 2,
        border: '1px solid #2AAC67',
        px: 0
      }}
      component="nav"
    >
      {roles.map((role) => (
        <React.Fragment key={role}>
          <ListItemButton onClick={() => handleClick(role)}>
            <ListItemIcon>
              <WorkIcon sx={{ color: '#2AAC67' }} />
            </ListItemIcon>
            <ListItemText primary={role} />
            {open[role] ? <ExpandLess sx={{ color: '#2AAC67' }} /> : <ExpandMore sx={{ color: '#2AAC67' }} />}
          </ListItemButton>
          <Collapse in={!!open[role]} timeout="auto" unmountOnExit>
            <TableContainer component={Paper} sx={{ my: 1, mx: 2, borderRadius: 2, boxShadow: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#2AAC67', fontWeight: 'bold' }}>POE</TableCell>
                    <TableCell sx={{ color: '#2AAC67', fontWeight: 'bold' }}>Descripción</TableCell>
                    <TableCell sx={{ color: '#2AAC67', fontWeight: 'bold' }}>Versión</TableCell>
                    <TableCell sx={{ color: '#2AAC67', fontWeight: 'bold' }}>Fecha de inducción</TableCell>
                    <TableCell sx={{ color: '#2AAC67', fontWeight: 'bold' }}>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(poePorRol[role] || []).map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.poe}</TableCell>
                      <TableCell>{row.descripcion}</TableCell>
                      <TableCell>{row.version}</TableCell>
                      <TableCell>{row.fecha}</TableCell>
                      <TableCell>
                        {row.estado ? (
                          <CheckCircleIcon sx={{ color: '#2AAC67' }} />
                        ) : (
                          <CancelIcon sx={{ color: '#e53935' }} />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {(poePorRol[role] || []).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ color: '#888' }}>
                        No hay registros de capacitación para este rol.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Collapse>
        </React.Fragment>
      ))}
    </List>
  );
}