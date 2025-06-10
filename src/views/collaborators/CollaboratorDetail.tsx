import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CollaboratorRolesList from "../../components/CollaboratorRolesList";
//import { transform } from "framer-motion";

export default function CollaboratorDetail() {
  const collaborator = {
    nombre: "Juan",
    apellidos: "Pérez Gómez",
    cedula: "0102030405",
    compania: "Natural Aloe S.A.",
    departamento: "Producción",
    puesto: "Operador de Lavandería",
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      {/*cuando blanco que contien toda la información del colaborador*/}
      <Paper
        elevation={8}
        sx={{
          display: "flex",
          flexDirection: "row",
          borderRadius: 6,
          p: 5,
          width: "90%",
          maxWidth: 1200,
          bgcolor: "#fff",
          border: "2px solid #2AAC67",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/*cuadro que contiene la información del colaborador*/}
        <Box
          sx={{
            minWidth: 300,
            maxWidth: 340,
            mr: 5,
            bgcolor: "#F6FBF7",
            borderRadius: 4,
            p: 3,
            border: "1px solid #2AAC67",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "#2AAC67", 
              fontWeight: "bold", 
              mb: 2.5,
              letterSpacing: "0.5px"
             }}
          >
            Información del Colaborador
          </Typography>
          <TextField
            label="Nombre"
            value={collaborator.nombre}
            InputProps={{ readOnly: true }}
            variant="outlined"
            size="small"
            disabled
            sx={{
              mb: 2.5, 
              width: '100%',
              borderRadius: 3, 
              backgroundColor: '#fff', 
              WebkitTextFillColor: "#18703f", 
              '& .MuiInputBase-input': { WebkitTextFillColor: "#222 !important"},
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#2AAC67 !important'}, 
                '&:hover fieldset': { borderColor: 'black !important'}, 
                transition: 'background-color 0.3s ease', 
                '&:hover': { backgroundColor: '#E6F3EA' } 
              },
            }}
          />
          <TextField
            label="Apellidos"
            value={collaborator.apellidos}
            InputProps={{ readOnly: true }}
            variant="outlined"
            size="small"
            disabled
            sx={{
              mb: 2.5, 
              width: '100%',
              borderRadius: 3, 
              backgroundColor: '#fff', 
              WebkitTextFillColor: "#18703f", 
              '& .MuiInputBase-input': { WebkitTextFillColor: "#222 !important"},
              '& .MuiOutlinedInput-root': { 
                '& fieldset': { borderColor: '#2AAC67 !important'}, 
                '&:hover fieldset': { borderColor: 'black !important'}, 
                transition: 'background-color 0.3s ease', 
                '&:hover': { backgroundColor: '#E6F3EA' } 
              },
            }}
          />
          <TextField
            label="Cédula"
            value={collaborator.cedula}
            InputProps={{ readOnly: true }}
            variant="outlined"
            size="small"
            disabled
            sx={{
              mb: 2.5, 
              width: '100%',
              borderRadius: 3, 
              backgroundColor: '#fff', 
              WebkitTextFillColor: "#18703f", 
              '& .MuiInputBase-input': { WebkitTextFillColor: "#222 !important"},
              '& .MuiOutlinedInput-root': { 
                '& fieldset': { borderColor: '#2AAC67 !important'}, 
                '&:hover fieldset': { borderColor: 'black !important'}, 
                transition: 'background-color 0.3s ease', 
                '&:hover': { backgroundColor: '#E6F3EA' } 
              },
            }}
          />
          <TextField
            label="Compañía"
            value={collaborator.compania}
            InputProps={{ readOnly: true }}
            variant="outlined"
            size="small"
            disabled
            sx={{
              mb: 2.5, 
              width: '100%',
              borderRadius: 3, 
              backgroundColor: '#fff', 
              WebkitTextFillColor: "#18703f", 
              '& .MuiInputBase-input': { WebkitTextFillColor: "#222 !important"},
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#2AAC67 !important'}, 
                '&:hover fieldset': { borderColor: 'black !important'}, 
                transition: 'background-color 0.3s ease', 
                '&:hover': { backgroundColor: '#E6F3EA' } 
              },
            }}
          />
          <TextField
            label="Departamento"
            value={collaborator.departamento}
            InputProps={{ readOnly: true }}
            variant="outlined"
            size="small"
            disabled
            sx={{
              mb: 2.5, 
              width: '100%',
              borderRadius: 3, 
              backgroundColor: '#fff', 
              WebkitTextFillColor: "#18703f", 
              '& .MuiInputBase-input': { WebkitTextFillColor: "#222 !important"},
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#2AAC67 !important'}, 
                '&:hover fieldset': { borderColor: 'black !important'}, 
                transition: 'background-color 0.3s ease', 
                '&:hover': { backgroundColor: '#E6F3EA' } 
              },
            }}
          />
          <TextField
            label="Puesto de trabajo"
            value={collaborator.puesto}
            InputProps={{ readOnly: true }}
            variant="outlined"
            size="small"
            disabled
            sx={{
              mb: 2.5, 
              width: '100%',
              borderRadius: 3, 
              backgroundColor: '#fff', 
              WebkitTextFillColor: "#18703f", 
              '& .MuiInputBase-input': { WebkitTextFillColor: "#222 !important"},
              '& .MuiOutlinedInput-root': { 
                '& fieldset': { borderColor: '#2AAC67 !important'}, 
                '&:hover fieldset': { borderColor: 'black !important'}, 
                transition: 'background-color 0.3s ease', 
                '&:hover': { backgroundColor: '#E6F3EA' } 
              },
            }}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h5"
            sx={{
              color: "#2AAC67",
              fontWeight: "bold",
              mb: 2.5,
              letterSpacing: "0.5px",
            }}
          >
            Roles de Trabajo y Capacitaciones
          </Typography>
          <CollaboratorRolesList />
        </Box>
      </Paper>
    </Box>
  );
}
