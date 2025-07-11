import React from 'react';
import { Card, CardContent, Avatar, Typography, Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

interface CollaboratorCardProps {
  id: string;
  nombre: string;
  puesto?: string;
  onClick: (id: string) => void;
}

const CollaboratorCard: React.FC<CollaboratorCardProps> = ({ id, nombre, puesto, onClick }) => (
  <Card
    onClick={() => onClick(id)}
    sx={{
      height: 240,
      minWidth: 0,
      width: '100%',
      minHeight: 120,
      maxHeight: 240,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      borderRadius: 3,
      boxShadow: '0 2px 8px 0 rgba(42,172,103,0.06)',
      background: '#ffffff',
      border: '1px solid #2AAC67',
      transition: 'transform 0.18s, box-shadow 0.18s, border 0.18s',
      '&:hover': {
        transform: 'scale(1.025)',
        boxShadow: '0 6px 18px 0 #A6E8C7',
        border: '1.5px solid #2AAC67',
      },
      fontFamily: 'Poppins, sans-serif',
      p: 1.5,
      m: 'auto',
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
        gap: 1,
        p: 0,
      }}
    >
      <Avatar
        sx={{
          width: 54,
          height: 54,
          bgcolor: '#2AAC67',
          color: '#fff',
          fontFamily: 'Poppins, sans-serif',
          mb: 1,
          boxShadow: '0 2px 8px 0 rgba(42,172,103,0.10)',
        }}
      >
        <PersonIcon sx={{ fontSize: 32 }} />
      </Avatar>
      <Typography
        variant="body2"
        sx={{
          color: '#2AAC67',
          fontFamily: 'Poppins, sans-serif',
          textAlign: 'center',
          fontWeight: 500,
          letterSpacing: 1,
          fontSize: '0.85rem',
        }}
      >
        ID: {id}
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          color: '#2AAC67',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 600,
          textAlign: 'center',
          fontSize: '1rem',
        }}
      >
        {nombre}
      </Typography>
      {puesto && (
        <Box
          sx={{
            mt: 0.5,
            px: 1.5,
            py: 0.2,
            bgcolor: '#E0F5EA',
            borderRadius: 1,
            display: 'inline-block',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#2AAC67',
              fontFamily: 'Poppins, sans-serif',
              textAlign: 'center',
              fontWeight: 500,
              fontSize: '0.85rem',
            }}
          >
            {puesto}
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

export default CollaboratorCard;