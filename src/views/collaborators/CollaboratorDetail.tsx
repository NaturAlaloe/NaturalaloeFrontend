import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CollaboratorRolesList from '../../components/CollaboratorRolesList';

export default function CollaboratorDetail() {
  // Datos de ejemplo del colaborador
  const collaborator = {
    nombre: 'Juan',
    apellidos: 'Pérez Gómez',
    cedula: '0102030405',
    compania: 'Natural Aloe S.A.',
    departamento: 'Producción',
    puesto: 'Operador de Lavandería'
  };

  return (
    <Box
      sx={{
        minHeight: '90vh',
        bgcolor: '#F6FBF7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Paper
        elevation={4}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          borderRadius: 4,
          p: 4,
          width: '90%',
          maxWidth: 1200,
          bgcolor: '#fff',
          border: '2px solid #2AAC67'
        }}
      >
        {/* Lateral izquierdo: Información del colaborador */}
        <Box
          sx={{
            minWidth: 300,
            maxWidth: 340,
            mr: 4,
            bgcolor: '#F6FBF7',
            borderRadius: 3,
            p: 3,
            border: '1px solid #2AAC67',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography variant="h6" sx={{ color: '#2AAC67', fontWeight: 'bold', mb: 2 }}>
            Información del Colaborador
          </Typography>
          <TextField
            label="Nombre"
            value={collaborator.nombre}
            InputProps={{ readOnly: true }}
            variant="outlined"
            size="small"
            sx={{ mb: 2, width: '100%' }}
          />
          <TextField
            label="Apellidos"
            value={collaborator.apellidos}
            InputProps={{ readOnly: true }}
            variant="outlined"
            size="small"
            sx={{ mb: 2, width: '100%' }}
          />
          <TextField
            label="Cédula"
            value={collaborator.cedula}
            InputProps={{ readOnly: true }}
            variant="outlined"
            size="small"
            sx={{ mb: 2, width: '100%' }}
          />
          <TextField
            label="Compañía"
            value={collaborator.compania}
            InputProps={{ readOnly: true }}
            variant="outlined"
            size="small"
            sx={{ mb: 2, width: '100%' }}
          />
          <TextField
            label="Departamento"
            value={collaborator.departamento}
            InputProps={{ readOnly: true }}
            variant="outlined"
            size="small"
            sx={{ mb: 2, width: '100%' }}
          />
          <TextField
            label="Puesto de trabajo"
            value={collaborator.puesto}
            InputProps={{ readOnly: true }}
            variant="outlined"
            size="small"
            sx={{ width: '100%' }}
          />
        </Box>
        {/* Derecha: Lista de roles y tablas */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ color: '#2AAC67', fontWeight: 'bold', mb: 2 }}>
            Roles de Trabajo y Capacitaciones
          </Typography>
          <CollaboratorRolesList />
        </Box>
      </Paper>
    </Box>
  );
}