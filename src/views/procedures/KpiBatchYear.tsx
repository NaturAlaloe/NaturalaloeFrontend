import React, { useState, useEffect } from "react";
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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../apiConfig/api";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

// Define type for document
type Document = {
  codigo: string;
  tipo: string;
  razon: string;
};

export default function KpiBatchYear() {
  const [idArea, setIdArea] = useState<number | "">("");
  const [idResponsable, setIdResponsable] = useState<number | "">("");
  const [estado, setEstado] = useState("actualizar");
  const [usuario, setUsuario] = useState(""); // Should be populated from JWT
  const [docs, setDocs] = useState<Document[]>([
    { codigo: "", tipo: "POE", razon: "" }
  ]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<"success" | "error">("success");

  // If you have JWT auth, use this useEffect to get the user
  useEffect(() => {
    // Example: setUsuario(userFromJWT);
  }, []);

  const handleDocChange = (idx: number, field: keyof Document, value: string) => {
    setDocs(prev => 
      prev.map((doc, i) => 
        i === idx ? { ...doc, [field]: value } : doc
      )
    );
  };

  const addDoc = () => {
    if (docs.length >= 10) {
      showCustomToast("Advertencia", "Máximo 10 documentos por lote", "warning");
      return;
    }
    setDocs([...docs, { codigo: "", tipo: "POE", razon: "" }]);
  };

  const removeDoc = (idx: number) => {
    if (docs.length <= 1) {
      showCustomToast("Advertencia", "Debe haber al menos un documento", "warning");
      return;
    }
    setDocs(docs.filter((_, i) => i !== idx));
  };

  const validateForm = (): boolean => {
    if (!idArea || !idResponsable) {
      setMsg("El ID del área y del responsable son requeridos");
      setMsgType("error");
      return false;
    }

    if (!usuario) {
      setMsg("El usuario es requerido");
      setMsgType("error");
      return false;
    }

    const invalidDocs = docs.some(d => !d.codigo || !d.razon);
    if (invalidDocs) {
      setMsg("Todos los documentos deben tener código y razón completos");
      setMsgType("error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (!validateForm()) return;

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
        setMsg("Lote de KPIs creado correctamente. Recuerda que los POEs no se consideran actualizados hasta que el 100% de la gente esté capacitada.");
        setMsgType("success");
        showCustomToast("Éxito", "Lote de KPIs creado correctamente", "success");
        // Reset form but keep area and responsible for potential new batches
        setDocs([{ codigo: "", tipo: "POE", razon: "" }]);
      } else {
        throw new Error(res.data.message || "Error al crear lote de KPIs");
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 
                     err.message || 
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
        
        <Typography variant="body1" mb={3} color="text.secondary">
          Nota: Al actualizar un POE (incrementar versión), este no se considerará actualizado 
          hasta que el 100% del personal esté capacitado en la nueva versión.
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="ID Área"
                value={idArea}
                onChange={(e) => setIdArea(Number(e.target.value) || "")}
                type="number"
                fullWidth
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="ID Responsable"
                value={idResponsable}
                onChange={(e) => setIdResponsable(Number(e.target.value) || "")}
                type="number"
                fullWidth
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value as string)}
                  label="Estado"
                  required
                >
                  <MenuItem value="actualizar">Actualizar</MenuItem>
                  <MenuItem value="obsoletar">Obsoletar</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" mt={2} mb={1}>
                Documentos POE ({docs.length})
              </Typography>
              <Table size="small" sx={{ mb: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell width="30%">Código</TableCell>
                    <TableCell width="20%">Tipo</TableCell>
                    <TableCell width="40%">Razón de actualización</TableCell>
                    <TableCell width="10%" align="center">Acción</TableCell>
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
                          fullWidth
                          required
                          placeholder="Ej: 100-24-001"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={doc.tipo}
                          onChange={e => handleDocChange(idx, "tipo", e.target.value)}
                          size="small"
                          fullWidth
                          required
                          disabled
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={doc.razon}
                          onChange={e => handleDocChange(idx, "razon", e.target.value)}
                          size="small"
                          fullWidth
                          required
                          placeholder="Ej: Actualización de procedimiento interno anual"
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
                </TableBody>
              </Table>
              
              <Button
                startIcon={<AddCircleIcon />}
                onClick={addDoc}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
              >
                Agregar Documento
              </Button>
              
              <Typography variant="body2" color="text.secondary">
                Cantidad planificada: {docs.length} documento{docs.length !== 1 ? 's' : ''}
              </Typography>
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