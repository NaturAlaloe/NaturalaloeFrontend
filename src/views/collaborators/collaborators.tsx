import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  CircularProgress, 
  Alert, 
  Typography,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import useCollaborators from '../../hooks/collaborator/useCollaborators';
import CollaboratorCard from '../../components/globalComponents/CollaboratorCard';
import FullScreenSpinner from '../../components/globalComponents/FullScreenSpinner'; // <-- Importa el spinner



const Collaborators: React.FC = () => {
  const navigate = useNavigate();
  const { collaborators, loading, error, searchTerm, setSearchTerm } = useCollaborators();
  const firstLoad = useRef(true);

  // Cuando loading pasa de true a false, ya no es la primera carga
  React.useEffect(() => {
    if (!loading) {
      firstLoad.current = false;
    }
  }, [loading]);

  const handleCardClick = (id: string) => {
    navigate(`/collaborators/detail/${id}`);
  };

  // Solo muestra el spinner a pantalla completa en la primera carga
  if (loading && firstLoad.current) {
    return <FullScreenSpinner />;
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ 
        fontWeight: 'bold', 
        mb: 4,
        color: '#2AAC67',
        textAlign: 'center'
      }}>
        Colaboradores
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por nombre o código"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ 
            maxWidth: 600,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#2AAC67',
              },
              '&:hover fieldset': {
                borderColor: '#13bd62',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#13bd62',
              },
            },
            '& .MuiInputAdornment-root .MuiSvgIcon-root': {
              color: '#2AAC67',
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: loading && (
              <CircularProgress size={24} color="inherit" />
            )
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" color="success" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {collaborators.length === 0 ? (
        <Alert severity="info" color="success" sx={{ mt: 2 }}>
          {searchTerm ? 
            `No se encontraron colaboradores con "${searchTerm}"` : 
            'No hay colaboradores disponibles'}
        </Alert>
      ) : (
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 3,
          mt: 2
        }}>
          {collaborators.slice(0, 3).map((colab) => (
            <CollaboratorCard
              key={colab.id_colaborador}
              id={colab.id_colaborador}
              nombre={`${colab.nombre} ${colab.apellido1} ${colab.apellido2}`}
              puesto={colab.puesto}
              onClick={handleCardClick}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Collaborators;