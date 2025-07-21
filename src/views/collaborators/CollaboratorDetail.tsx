import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import React from "react";
import useCollaboratorDetail from "../../hooks/collaborator/useCollaboratorDetail";
import CollaboratorRolesList from "../../components/CollaboratorRolesList";
import FullScreenSpinner from "../../components/globalComponents/FullScreenSpinner";

export default function CollaboratorDetail() {
  const { id } = useParams<{ id: string }>();
  const [refreshKey, setRefreshKey] = React.useState(0);
  const { data, loading, error } = useCollaboratorDetail(id || "", refreshKey);

  if (loading) return  <FullScreenSpinner />;
  if (error || !data)
    return (
      <Box sx={{ p: 5, textAlign: "center", color: "red" }}>
        No se pudo cargar el colaborador.
      </Box>
    );

  const personal = data.roles[0];
  const apellidos = [data.apellido1, data.apellido2].filter(Boolean).join(" ");

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      {/*Cuadro que contiene TODA la información del colaborador*/}
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
            height: "fit-content",
            alignSelf: "flex-start",
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
            sx={{
              color: "#2AAC67",
              fontWeight: "bold",
              mb: 2.5,
              letterSpacing: "0.5px",
            }}
          >
            Información del Colaborador
          </Typography>
          <TextField
            label="Cédula"
            value={data.cedula}
            InputProps={{ readOnly: true }}
            variant="outlined"
            size="small"
            disabled
            sx={{
              mb: 2.5,
              width: "100%",
              borderRadius: 3,
              backgroundColor: "#fff",
              WebkitTextFillColor: "#18703f",
              "& .MuiInputBase-input": {
                WebkitTextFillColor: "#222 !important",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#2AAC67 !important" },
                "&:hover fieldset": { borderColor: "black !important" },
                transition: "background-color 0.3s ease",
                "&:hover": { backgroundColor: "#E6F3EA" },
              },
            }}
          />
          <TextField
            label="Nombre"
            value={data.nombre}
            InputProps={{ readOnly: true }}
            variant="outlined"
            size="small"
            disabled
            sx={{
              mb: 2.5,
              width: "100%",
              borderRadius: 3,
              backgroundColor: "#fff",
              WebkitTextFillColor: "#18703f",
              "& .MuiInputBase-input": {
                WebkitTextFillColor: "#222 !important",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#2AAC67 !important" },
                "&:hover fieldset": { borderColor: "black !important" },
                transition: "background-color 0.3s ease",
                "&:hover": { backgroundColor: "#E6F3EA" },
              },
            }}
          />
          <TextField
            label="Apellidos"
            value={apellidos}
            InputProps={{ readOnly: true }}
            variant="outlined"
            size="small"
            disabled
            sx={{
              mb: 2.5,
              width: "100%",
              borderRadius: 3,
              backgroundColor: "#fff",
              WebkitTextFillColor: "#18703f",
              "& .MuiInputBase-input": {
                WebkitTextFillColor: "#222 !important",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#2AAC67 !important" },
                "&:hover fieldset": { borderColor: "black !important" },
                transition: "background-color 0.3s ease",
                "&:hover": { backgroundColor: "#E6F3EA" },
              },
            }}
          />
          <TextField
            label="Puesto"
            value={personal.puesto}
            InputProps={{ readOnly: true }}
            variant="outlined"
            size="small"
            disabled
            sx={{
              mb: 2.5,
              width: "100%",
              borderRadius: 3,
              backgroundColor: "#fff",
              WebkitTextFillColor: "#18703f",
              "& .MuiInputBase-input": {
                WebkitTextFillColor: "#222 !important",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#2AAC67 !important" },
                "&:hover fieldset": { borderColor: "black !important" },
                transition: "background-color 0.3s ease",
                "&:hover": { backgroundColor: "#E6F3EA" },
              },
            }}
          />
          <TextField
            label="Departamento"
            value={personal.departamento}
            InputProps={{ readOnly: true }}
            variant="outlined"
            size="small"
            disabled
            sx={{
              mb: 2.5,
              width: "100%",
              borderRadius: 3,
              backgroundColor: "#fff",
              WebkitTextFillColor: "#18703f",
              "& .MuiInputBase-input": {
                WebkitTextFillColor: "#222 !important",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#2AAC67 !important" },
                "&:hover fieldset": { borderColor: "black !important" },
                transition: "background-color 0.3s ease",
                "&:hover": { backgroundColor: "#E6F3EA" },
              },
            }}
          />
          <TextField
            label="Área"
            value={personal.area}
            InputProps={{ readOnly: true }}
            variant="outlined"
            size="small"
            disabled
            sx={{
              mb: 2.5,
              width: "100%",
              borderRadius: 3,
              backgroundColor: "#fff",
              WebkitTextFillColor: "#18703f",
              "& .MuiInputBase-input": {
                WebkitTextFillColor: "#222 !important",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#2AAC67 !important" },
                "&:hover fieldset": { borderColor: "black !important" },
                transition: "background-color 0.3s ease",
                "&:hover": { backgroundColor: "#E6F3EA" },
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
            Roles de Trabajo
          </Typography>
          <CollaboratorRolesList
            roles={data.roles}
            onRefresh={() => setRefreshKey((k) => k + 1)}
          />
        </Box>
      </Paper>
    </Box>
  );
}
