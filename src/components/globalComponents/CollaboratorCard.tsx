import React from 'react';
import { Card, CardContent, Avatar, Box, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

interface CollaboratorCardProps {
  id: string;
  nombre: string;
  puesto?: string;
  onClick: (id: string) => void;
}

const CollaboratorCard: React.FC<CollaboratorCardProps> = ({ id, nombre, puesto, onClick }) => (
  <Card
    key={id}
    onClick={() => onClick(id)}
    sx={{
      minWidth: 320,
      minHeight: 220,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'transform 0.3s, box-shadow 0.3s',
      fontFamily: 'Poppins, sans-serif',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: 3
      }
    }}
  >
    <CardContent
      sx={{
        flexGrow: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 3
      }}
    >
      <Avatar
        sx={{
          width: 80,
          height: 80,
          bgcolor: '#A6E8C7',
          color: '#2AAC67',
          fontFamily: 'Poppins, sans-serif',
          mb: 2
        }}
      >
        <PersonIcon sx={{ fontSize: 48 }} />
      </Avatar>
      <Typography
        variant="body1"
        sx={{
          color: '#2AAC67',
          fontFamily: 'Poppins, sans-serif',
          textAlign: 'center'
        }}
      >
        ID: {id}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          color: '#2AAC67',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 600,
          textAlign: 'center'
        }}
      >
        {nombre}
      </Typography>
      {puesto && (
        <Typography
          variant="body2"
          sx={{
            color: '#2AAC67',
            fontFamily: 'Poppins, sans-serif',
            textAlign: 'center'
          }}
        >
          Puesto: {puesto}
        </Typography>
      )}
    </CardContent>
  </Card>
);

export default CollaboratorCard;