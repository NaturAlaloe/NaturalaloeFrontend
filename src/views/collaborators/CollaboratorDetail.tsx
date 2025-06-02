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
        background: 'linear-gradient(135deg, #E6F3EA 0%, #F6FBF7 100%)', // Gradiente sutil
        bgcolor: '#F6FBF7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
        
      }}
    >
      {/* Cuadro blanco que contiene toda la informacion*/}
      <Paper
        elevation={4}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          borderRadius: 6,
          p: 5,
          width: '90%',
          maxWidth: 1200,
          bgcolor: '#fff',
          border: '2px solid #2AAC67',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)', //una sombra mas profunda
          transition: 'transform 0.3s ease, box-shadow 0.3s ease', // nueva transicion
          '&:hover': {
            transform: 'scale(1.02)', // una escala al cuadro
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' // sombra mas intensa al hover
          }
        }}
      >
        {/* Lateral izquierdo: Información del colaborador */}
        <Box
          sx={{
            minWidth: 300,
            maxWidth: 340,
            mr: 5,
            bgcolor: '#F6FBF7',
            borderRadius: 4,
            p: 3,
            border: '1px solid #2AAC67',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Nueva transición para efectos suaves
            '&:hover': { // Nuevo efecto al pasar el cursor
            transform: 'scale(1.02)', // Escala ligeramente el cuadro
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' // Sombra más intensa al hover
          }
          }}
        >
          <Typography variant="h6" sx={{ color: '#2AAC67', fontWeight: 'bold', mb: 6}}>
            Información del Colaborador
          </Typography>
          <TextField
            label="Nombre"
            value={collaborator.nombre}
            InputProps={{ readOnly: true }}
            variant="outlined"
            size="small"
            sx={{ mb: 2.5, 
              width: '100%', 
              backgroundColor: '#fff', // fondo blanco
              '& .MuiOutlinedInput-root': { // personalizacion del borde
                '& fieldset': { borderColor: '#2AAC67' }, // borde verde base
                '&:hover fieldset': { borderColor: 'black' }, // borde oscuro al hover
                transition: 'background-color 0.3s ease', // nueva transicion suave
                '&:hover': { backgroundColor: '#E6F3EA' } // nuevo fondo verde claro al hover
              }


            }}
          />
          <TextField
            label="Apellidos"
            value={collaborator.apellidos}
            InputProps={{ readOnly: true }}
            variant="outlined"
            size="small"
            sx={{ mb: 2.5, 
              width: '100%', 
              backgroundColor: '#fff', 
              '& .MuiOutlinedInput-root': { 
                '& fieldset': { borderColor: '#2AAC67' },
                '&:hover fieldset': { borderColor: 'black' }, 
                transition: 'background-color 0.3s ease', 
                '&:hover': { backgroundColor: '#E6F3EA' } 
              }
            }}
          />
          <TextField
            label="Cédula"
            value={collaborator.cedula}
            InputProps={{ readOnly: true }}
            variant="outlined"
            size="small"
            sx={{ mb: 2.5, 
              width: '100%', 
              backgroundColor: '#fff', 
              '& .MuiOutlinedInput-root': { 
                '& fieldset': { borderColor: '#2AAC67' },
                '&:hover fieldset': { borderColor: 'black' }, 
                transition: 'background-color 0.3s ease', 
                '&:hover': { backgroundColor: '#E6F3EA' } 
              }
            }}
          />
          <TextField
            label="Compañía"
            value={collaborator.compania}
            InputProps={{ readOnly: true }}
            variant="outlined"
            size="small"
           sx={{ mb: 2.5, 
              width: '100%', 
              backgroundColor: '#fff', 
              '& .MuiOutlinedInput-root': { 
                '& fieldset': { borderColor: '#2AAC67' },
                '&:hover fieldset': { borderColor: 'black' }, 
                transition: 'background-color 0.3s ease', 
                '&:hover': { backgroundColor: '#E6F3EA' } 
              }
            }}
          />
          <TextField
            label="Departamento"
            value={collaborator.departamento}
            InputProps={{ readOnly: true }}
            variant="outlined"
            size="small"
           sx={{ mb: 2.5, 
              width: '100%', 
              backgroundColor: '#fff', 
              '& .MuiOutlinedInput-root': { 
                '& fieldset': { borderColor: '#2AAC67' },
                '&:hover fieldset': { borderColor: 'black' }, 
                transition: 'background-color 0.3s ease', 
                '&:hover': { backgroundColor: '#E6F3EA' } 
              }
            }}
          />
          <TextField
            label="Puesto de trabajo"
            value={collaborator.puesto}
            InputProps={{ readOnly: true }}
            variant="outlined"
            size="small"
            sx={{ mb: 2.5, 
              width: '100%', 
              backgroundColor: '#fff', 
              '& .MuiOutlinedInput-root': { 
                '& fieldset': { borderColor: '#2AAC67' },
                '&:hover fieldset': { borderColor: 'black' }, 
                transition: 'background-color 0.3s ease', 
                '&:hover': { backgroundColor: '#E6F3EA' } 
              }
            }}
          />
        </Box>
        {/* Derecha: Lista de roles y tablas */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ color: '#2AAC67', fontWeight: 'bold', mb: 2.5, letterSpacing: '0.5px'}}>
            Roles de Trabajo y Capacitaciones
          </Typography>
          <CollaboratorRolesList />
        </Box>
      </Paper>
    </Box>
  );
}