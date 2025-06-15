import React from 'react';
import { Card, CardContent, Typography, Avatar, Box } from '@mui/material';

interface CollaboratorCardProps {
  id: string;
  nombre: string;
  onClick: (id: string) => void;
}

const CollaboratorCard: React.FC<CollaboratorCardProps> = ({ id, nombre, onClick }) => (
  <Card
    key={id}
    onClick={() => onClick(id)}
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer',
      transition: 'transform 0.3s, box-shadow 0.3s',
      fontFamily: 'Poppins, sans-serif',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: 3
      }
    }}
  >
    <CardContent sx={{ flexGrow: 1 }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 2
      }}>
        <Avatar sx={{
          width: 56,
          height: 56,
          mr: 2,
          bgcolor: '#A6E8C7', // tono más bajo de #13bd62
          color: '#2AAC67',
          fontFamily: 'Poppins, sans-serif'
        }}>
          {nombre.charAt(0)}
        </Avatar>
        <Box>
          <Typography
            variant="h6"
            component="div"
            sx={{
              color: '#2AAC67',
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            {nombre}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#2AAC67',
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            Código: {id}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default CollaboratorCard;