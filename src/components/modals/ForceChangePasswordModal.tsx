import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  TextField,
  Button,
} from '@mui/material';
import { Warning } from '@mui/icons-material';
import { useState } from 'react';
import { useEditUser } from '../../hooks/updatePassword/useUpdatePassword'; // Asegúrate de que la ruta sea correcta
import { showCustomToast } from '../globalComponents/CustomToaster';

interface ForceChangePasswordModalProps {
  isOpen: boolean;
  onLogout: () => void;
}

export default function ForceChangePasswordModal({
  isOpen,
  onLogout,
}: ForceChangePasswordModalProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { handleEditUser, loading } = useEditUser();

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      showCustomToast('Información', 'Por favor, completa ambos campos.', 'info');
      return;
    }

    if (newPassword !== confirmPassword) {
      showCustomToast('Advertencia', 'Las contraseñas no coinciden.', 'info');
      return;
    }

    await handleEditUser({ nuevaContrasena: newPassword });

    onLogout();
  };

  return (
    <Dialog
      open={isOpen}
      disableEscapeKeyDown
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: '16px', padding: '8px' } }}
      BackdropProps={{ sx: { backdropFilter: 'blur(8px)' } }}
    >
      <DialogTitle sx={{ textAlign: 'center', paddingBottom: 1, color: '#FF6B35' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <Warning sx={{ fontSize: 28 }} />
          Cambio de Contraseña Requerido
        </Box>
      </DialogTitle>

      <DialogContent sx={{ textAlign: 'center', paddingY: 2 }}>
        <Typography variant="body1" sx={{ marginBottom: 2, color: '#666' }}>
          Por razones de seguridad, al iniciar sesión por primera vez, es obligatorio cambiar la contraseña antes de continuar.
        </Typography>

        <TextField
          type="password"
          label="Nueva contraseña"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ marginTop: 2, marginBottom: 2 }}
        />

        <TextField
          type="password"
          label="Confirmar contraseña"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', padding: 2 }}>
        <Button
          onClick={onLogout}
          variant="outlined"
          color="inherit"
          sx={{
            borderColor: '#FF6B35',
            color: '#FF6B35',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#ffe5db',
              borderColor: '#FF6B35',
            },
          }}
        >
          Cerrar sesión
        </Button>

        <Button
          onClick={handleUpdatePassword}
          variant="contained"
          disabled={loading}
          sx={{
            backgroundColor: '#FF6B35',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#e85c27',
            },
          }}
        >
          {loading ? 'Actualizando...' : 'Actualizar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
