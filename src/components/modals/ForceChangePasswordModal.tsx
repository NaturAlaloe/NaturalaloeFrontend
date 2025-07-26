import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box } from '@mui/material';
import { Warning } from '@mui/icons-material';

interface ForceChangePasswordModalProps {
  isOpen: boolean;
  onLogout: () => void;
}

export default function ForceChangePasswordModal({ isOpen, onLogout }: ForceChangePasswordModalProps) {
  return (
    <Dialog
      open={isOpen}
      disableEscapeKeyDown
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: '16px', padding: '8px' } }}
    >
      <DialogTitle sx={{ textAlign: 'center', paddingBottom: 1, color: '#FF6B35' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <Warning sx={{ fontSize: 28 }} />
          Cambio de Contraseña Requerido
        </Box>
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', paddingY: 2 }}>
        <Typography variant="body1" sx={{ marginBottom: 2, color: '#666' }}>
          Por motivos de seguridad, es necesario que cambies tu contraseña antes de continuar.
        </Typography>
        <Typography variant="body2" sx={{ color: '#888' }}>
          Esta acción es obligatoria y no puede ser omitida.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', paddingBottom: 2, flexDirection: 'column', gap: 1 }}>
        <Typography variant="caption" sx={{ color: '#999', mb: 1 }}>
          Modal funcional - Funcionalidad de cambio pendiente
        </Typography>
        <button
          onClick={onLogout}
          style={{
            background: '#FF6B35',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 20px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '8px'
          }}
        >
          Cerrar sesión
        </button>
      </DialogActions>
    </Dialog>
  );
}
