import React, { useState } from 'react'; 
import Box from '@mui/material/Box'; 
import Paper from '@mui/material/Paper'; 
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table'; 
import TableBody from '@mui/material/TableBody'; 
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer'; 
import TableHead from '@mui/material/TableHead'; 
import TableRow from '@mui/material/TableRow'; 
import Checkbox from '@mui/material/Checkbox'; 
import Button from '@mui/material/Button'; 
import Typography from '@mui/material/Typography'; 
import TablePagination from '@mui/material/TablePagination'; 

const colaboradores = [
  { id: '001', nombre: 'Juan Pérez' },
  { id: '002', nombre: 'María Gómez' },
  { id: '003', nombre: 'Carlos López' },
  { id: '004', nombre: 'Ana Martínez' },
  { id: '005', nombre: 'Pedro Rodríguez' },
  { id: '006', nombre: 'Roberto Castillo' },
  { id: '007', nombre: 'Elena Torres' },
  { id: '008', nombre: 'Fernando Ramírez' },
  { id: '009', nombre: 'Gabriela Mendoza' },
  { id: '010', nombre: 'Luis Ortega' },
  { id: '011', nombre: 'Valeria Ríos' }

];


const rolesDisponibles = [
  "Administrador",
  "Supervisor",
  "Operador",
  "Invitado",
  "Gerente de Planta",
  "Gerente de Calidad",
  "Gerente de Producción",
  "Gerente de Logística",
  "Gerente de Mantenimiento",
  "Gerente de Recursos Humanos",
  "Gerente de Finanzas",
  "Gerente de Ventas",
  "Gerente de Marketing",
  "Gerente de IT",
  "Gerente de Seguridad",
  "Gerente de Proyectos",
  "Gerente de Innovación",
];

export default function AssignRol() {
  const [busqueda, setBusqueda] = useState('');
  const [rolesSeleccionados, setRolesSeleccionados] = useState<string[]>([]); 
  const [colaboradorSeleccionado, setColaboradorSeleccionado] = useState<string | null>(null); 
  const [pagina, setPagina] = useState(0); 
  const rolesPorPagina = 7; 

  // Filtrar colaboradores según la búsqueda
  const colaboradoresFiltrados = colaboradores.filter((colaborador) =>
    colaborador.id.toLowerCase().includes(busqueda.toLowerCase()) ||
    colaborador.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Manejar cambio en el campo de búsqueda
  const manejarCambioBusqueda = (evento: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(evento.target.value);
    setColaboradorSeleccionado(null); 
  };

  // Manejar selección de colaborador
  const manejarSeleccionColaborador = (colaborador: { id: string; nombre: string }) => {
    setColaboradorSeleccionado(`${colaborador.id} - ${colaborador.nombre}`);
    setBusqueda(''); 
  };

  // Manejar selección de roles
  const manejarSeleccionRol = (rol: string) => {
    setRolesSeleccionados((prev) =>
      prev.includes(rol) ? prev.filter((r) => r !== rol) : [...prev, rol]
    );
  };

  // Manejar clic en el botón Guardar (simulación por ahora)
  const manejarGuardar = () => {
    if (colaboradorSeleccionado && rolesSeleccionados.length > 0) {
      alert(`Asignado a ${colaboradorSeleccionado}: ${rolesSeleccionados.join(', ')}`);
    } else {
      alert('Por favor, selecciona un colaborador y al menos un rol.');
    }
    // aqui se implementaria la logica para guardar en la base de datos 
  };

  // Manejar cambio de página
  const manejarCambioPagina = (evento: unknown, nuevaPagina: number) => {
    setPagina(nuevaPagina);
  };

  // Roles a mostrar en la página actual
  const rolesPaginados = rolesDisponibles.slice(
    pagina * rolesPorPagina,
    pagina * rolesPorPagina + rolesPorPagina
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #E6F3EA 0%, #F6FBF7 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 4,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: '90%',
          maxWidth: 800,
          p: 4,
          borderRadius: 6,
          border: '2px solid #2AAC67',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <Typography
          variant="h5"
          sx={{ color: '#2AAC67', fontWeight: 'bold', mb: 3, letterSpacing: '1px', textAlign: 'center' }}
        >
          Asignar Roles a Colaboradores
        </Typography>

        {/* Buscador de colaboradores con resultados en tiempo real */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar Colaboradores por nombre o id..."
          value={busqueda}
          onChange={manejarCambioBusqueda}
          sx={{
            mb: 2,
            borderRadius: 4,
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#2AAC67' },
              '&:hover fieldset': { borderColor: '#1F8A50' },
              transition: 'background-color 0.3s ease',
              '&:hover': { backgroundColor: '#E6F3EA' },
            },
          }}
        />
        {busqueda && (
          <Box sx={{ mb: 3, maxHeight: 150, overflowY: 'auto', bgcolor: '#F6FBF7', borderRadius: 4, p: 2 }}>
            {colaboradoresFiltrados.length > 0 ? (
              colaboradoresFiltrados.map((colaborador) => (
                <Typography
                  key={colaborador.id}
                  sx={{ color: '#208A53', mb: 1, cursor: 'pointer', '&:hover': { color: 'black', backgroundColor:'#E6F3EA' } }}
                  onClick={() => manejarSeleccionColaborador(colaborador)}
                >
                  {colaborador.id} - {colaborador.nombre}
                </Typography>
              ))
            ) : (
              <Typography sx={{ color: '#888' }}>No se encontraron colaboradores.</Typography>
            )}
          </Box>
        )}
        {colaboradorSeleccionado && (
          <Typography sx={{ color: 'black', mb: 3, fontWeight: 'bold' }}>
            Colaborador seleccionado: {colaboradorSeleccionado}
          </Typography>
        )}

        {/* Tabla de roles (solo visible si hay un colaborador seleccionado) */}
        {colaboradorSeleccionado && (
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
                {rolesPaginados.map((rol) => (
                  <TableRow
                    key={rol}
                    sx={{
                      transition: 'background-color 0.3s ease',
                      '&:hover': { backgroundColor: '#F0F8F2' },
                      py: 0.5, // Reducir espaciado vertical
                    }}
                  >
                    <TableCell sx={{ p: 1 }}>{rol}</TableCell>
                    <TableCell sx={{ p: 1 }}>
                      <Checkbox
                        checked={rolesSeleccionados.includes(rol)}
                        onChange={() => manejarSeleccionRol(rol)}
                        sx={{ color: '#2AAC67', '&.Mui-checked': { color: '#2AAC67' }, p: 0.5 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Botón de Guardar (solo visible si hay un colaborador seleccionado) */}
        {colaboradorSeleccionado && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={manejarGuardar}
              sx={{
                backgroundColor: '#2AAC67',
                '&:hover': { backgroundColor: '#1F8A50' },
                textTransform: 'none',
                fontWeight: 'bold',
                borderRadius: 2,
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                px: 4,
                py: 1,
              }}
            >
              Guardar
            </Button>
          </Box>
        )}
        {/* Inicio de la sección de paginación */}
        {colaboradorSeleccionado && (
          <TablePagination
            component="div"
            count={rolesDisponibles.length}
            rowsPerPage={rolesPorPagina}
            page={pagina}
            onPageChange={manejarCambioPagina}
            labelDisplayedRows={({ page }) => `Página ${page + 1} de ${Math.ceil(rolesDisponibles.length / rolesPorPagina)}`}
            rowsPerPageOptions={[]}
            sx={{ color: '#2AAC67', '& .MuiTablePagination-displayedRows': { color:'#208A53' } }}
          />
        )}
        {/* Fin de la sección de paginación */}
      </Paper>
    </Box>
  );
}