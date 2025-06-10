import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
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
import { Button } from '@mui/material';
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import Box from '@mui/material/Box';

// --- Modal de Capacitación ---
import TrainingModal from './TrainingModal';

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
};

export default function CollaboratorRolesList() {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null);

  const handleClick = (role: string) => {
    setOpen((prev) => ({ ...prev, [role]: !prev[role] }));
  };

  const handleOpenModal = (row: any) => {
    setModalData(row);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalData(null);
  };

  return (
    <>
      <List
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          borderRadius: 4,
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.12)',
          border: '1px solid #2AAC67',
          px: 0,
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.18)'
          }
        }}
        component="nav"
      >
        {roles.map((role) => (
          <React.Fragment key={role}>
            {/* Botón de cada rol */}
            <ListItemButton
              onClick={() => handleClick(role)}
              sx={{
                py: 1.2,
                transition: 'background-color 0.3s ease, transform 0.3s ease',
                '&:hover': {
                  backgroundColor: '#E6F3EA',
                  transform: 'translateX(5px)'
                }
              }}
            >
              <ListItemText
                primary={role}
                primaryTypographyProps={{
                  fontWeight: 'bold',
                  color: 'black',
                  letterSpacing: '0.5px'
                }}
              />
              {open[role] ? <ExpandLess sx={{ color: '#2AAC67' }} /> : <ExpandMore sx={{ color: '#2AAC67' }} />}
            </ListItemButton>
            {/* Sección colapsable */}
            <Collapse in={!!open[role]} timeout="auto" unmountOnExit>
              <TableContainer component={Paper}
                sx={{
                  my: 1, mx: 2,
                  borderRadius: 3,
                  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #2AAC67',
                  animation: 'fadeIn 0.5s ease-out',
                  '@keyframes fadeIn': {
                    '0%': { opacity: 0, transform: 'translateY(10px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                  }
                }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#2AAC67', fontWeight: 'bold', letterSpacing: '0.5px' }}>POE</TableCell>
                      <TableCell sx={{ color: '#2AAC67', fontWeight: 'bold', letterSpacing: '0.5px' }}>Descripción</TableCell>
                      <TableCell sx={{ color: '#2AAC67', fontWeight: 'bold', letterSpacing: '0.5px' }}>Versión</TableCell>
                      <TableCell sx={{ color: '#2AAC67', fontWeight: 'bold', letterSpacing: '0.5px' }}>Fecha de inducción</TableCell>
                      <TableCell sx={{ color: '#2AAC67', fontWeight: 'bold', letterSpacing: '0.5px' }}>Estado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(poePorRol[role] || []).map((row, idx) => (
                      <TableRow key={idx}
                        sx={{
                          transition: 'background-color 0.3s ease',
                          '&:hover': {
                            backgroundColor: '#F0F8F2'
                          }
                        }}
                      >
                        <TableCell>{row.poe}</TableCell>
                        <TableCell>{row.descripcion}</TableCell>
                        <TableCell>{row.version}</TableCell>
                        <TableCell>{row.fecha}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {row.estado ? (
                              <CheckCircleIcon sx={{ color: '#2AAC67', fontSize: '1.6rem' }} />
                            ) : (
                              <>
                                <CancelIcon sx={{ color: '#e53935', fontSize: '1.6rem' }} />
                                <Button
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  sx={{
                                    backgroundColor: '#2AAC67',
                                    '&:hover': { backgroundColor: '#1F8A50' },
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    borderRadius: 2,
                                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.3s ease',
                                  }}
                                  onClick={() => handleOpenModal(row)}
                                >
                                  <EditDocumentIcon />
                                </Button>
                              </>
                            )}
                          </Box>
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
      {/* Modal de capacitación */}
      <TrainingModal open={modalOpen} onClose={handleCloseModal} initialData={modalData} />
    </>
  );
}