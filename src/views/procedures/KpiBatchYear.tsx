import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../apiConfig/api";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

export default function KpiBatchYear() {
  const [idArea, setIdArea] = useState("");
  const [idResponsable, setIdResponsable] = useState("");
  const [estado, setEstado] = useState("actualizar");
  const [usuario, setUsuario] = useState(""); // Puedes traerlo del JWT si lo tienes
  const [docs, setDocs] = useState([
    { codigo: "", tipo: "POE", razon: "" }
  ]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<"success" | "error">("success");

  const handleDocChange = (idx: number, field: string, value: string) => {
    setDocs((prev) =>
      prev.map((doc, i) =>
        i === idx ? { ...doc, [field]: value } : doc
      )
    );
  };

  const addDoc = () => setDocs([...docs, { codigo: "", tipo: "POE", razon: "" }]);
  const removeDoc = (idx: number) => setDocs(docs.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (!idArea || !idResponsable || docs.some(d => !d.codigo || !d.razon) || !usuario) {
      setMsg("Completa todos los campos requeridos.");
      setMsgType("error");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        id_area: Number(idArea),
        id_responsable: Number(idResponsable),
        estado,
        cantidad_planificada: docs.length,
        docs_json: JSON.stringify(docs),
        usuario,
      };
      const res = await api.post("/procedures/kpi/year", payload);
      if (res.data.success) {
        setMsg(res.data.message || "Lote de KPIs creado correctamente");
        setMsgType("success");
        showCustomToast("Éxito", res.data.message, "success");
        setDocs([{ codigo: "", tipo: "POE", razon: "" }]);
      } else {
        setMsg(res.data.message || "Error al crear lote de KPIs");
        setMsgType("error");
        showCustomToast("Error", res.data.message, "error");
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        "Error al crear lote de KPIs para reglas anuales";
      setMsg(errorMsg);
      setMsgType("error");
      showCustomToast("Error", errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={2} color="primary">
          Crear lote de KPIs anuales (POE)
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="ID Área"
                value={idArea}
                onChange={(e) => setIdArea(e.target.value)}
                type="number"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="ID Responsable"
                value={idResponsable}
                onChange={(e) => setIdResponsable(e.target.value)}
                type="number"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                fullWidth
                required
                helperText="Nombre de usuario (puedes traerlo del JWT)"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" mt={2} mb={1}>
                Documentos POE
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Razón</TableCell>
                    <TableCell align="center">Acción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {docs.map((doc, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <TextField
                          value={doc.codigo}
                          onChange={e => handleDocChange(idx, "codigo", e.target.value)}
                          size="small"
                          required
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={doc.tipo}
                          onChange={e => handleDocChange(idx, "tipo", e.target.value)}
                          size="small"
                          required
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={doc.razon}
                          onChange={e => handleDocChange(idx, "razon", e.target.value)}
                          size="small"
                          required
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() => removeDoc(idx)}
                          disabled={docs.length === 1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Button
                        startIcon={<AddCircleIcon />}
                        onClick={addDoc}
                        color="primary"
                        variant="outlined"
                        size="small"
                      >
                        Agregar Documento
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Crear lote de KPIs"}
          </Button>
        </form>
        {msg && (
          <Alert severity={msgType} sx={{ mt: 2 }}>
            {msg}
          </Alert>
        )}
      </Paper>
    </Box>
  );
}