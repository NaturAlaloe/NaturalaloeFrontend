import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import AssignmentIcon from "@mui/icons-material/Assignment";
import InfoIcon from "@mui/icons-material/Info";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface NoProceduresMessageProps {
  collaboratorName?: string;
  message?: string;
}

export default function NoProceduresMessage({
  collaboratorName,
  message = "El colaborador no posee ningún rol con procedimientos asignados actualmente."
}: NoProceduresMessageProps) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        px: 4,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 6,
          p: 6,
          maxWidth: 600,
          width: "100%",
          bgcolor: "#fff",
          border: "2px solid #2AAC67",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        {/* Icono principal */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: "50%",
            bgcolor: "#F6FBF7",
            border: "3px solid #2AAC67",
            mb: 3,
          }}
        >
          <AssignmentIcon
            sx={{
              fontSize: 40,
              color: "#2AAC67",
            }}
          />
        </Box>

        {/* Título */}
        <Typography
          variant="h5"
          sx={{
            color: "#2AAC67",
            fontWeight: "bold",
            mb: 2,
            letterSpacing: "0.5px",
          }}
        >
          Sin Procedimientos Asignados
        </Typography>

        {/* Nombre del colaborador */}
        {collaboratorName && (
          <Typography
            variant="h6"
            sx={{
              color: "#333",
              fontWeight: "medium",
              mb: 2,
            }}
          >
            {collaboratorName}
          </Typography>
        )}

        {/* Mensaje informativo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 2,
            mb: 4,
            p: 3,
            bgcolor: "#F0F8F2",
            borderRadius: 3,
            border: "1px solid #C8E6C9",
          }}
        >
          <InfoIcon
            sx={{
              color: "#2AAC67",
              fontSize: 24,
              mt: 0.5,
            }}
          />
          <Typography
            variant="body1"
            sx={{
              color: "#555",
              lineHeight: 1.6,
              textAlign: "center",
            }}
          >
            {message}
          </Typography>
        </Box>

        {/* Información adicional */}
        <Typography
          variant="body2"
          sx={{
            color: "#777",
            mb: 4,
            lineHeight: 1.5,
          }}
        >
          Para asignar procedimientos a este colaborador, dirigirse a la gestión de Procedimientos o a la asignación de roles que contengan POEs.
        </Typography>

        {/* Botón de regreso */}
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{
            backgroundColor: "#2AAC67",
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: 3,
            px: 4,
            py: 1.5,
            boxShadow: "0 4px 12px rgba(42, 172, 103, 0.3)",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#1F8A50",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 16px rgba(42, 172, 103, 0.4)",
            },
          }}
        >
          Regresar a la Lista
        </Button>
      </Paper>
    </Box>
  );
}
