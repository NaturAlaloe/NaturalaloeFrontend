import React, { useState } from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Button } from "@mui/material";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import Box from "@mui/material/Box";
import TrainingModal from "./TrainingModal";
import type { ICollaboratorDetailRole } from "../services/manage/collaboratorService";
import { useParams } from "react-router-dom";

interface CollaboratorRolesListProps {
  roles: ICollaboratorDetailRole[];
  onRefresh?: () => void;
}

export default function CollaboratorRolesList({
  roles,
  onRefresh,
}: CollaboratorRolesListProps) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const { id: id_colaborador } = useParams<{ id: string }>();

  const handleClick = (role: string) => {
    setOpen((prev) => ({ ...prev, [role]: !prev[role] }));
  };

  const handleOpenModal = (row: any) => {
    setModalData({
      ...row,
      id_colaborador: Number(id_colaborador),
      id_documento_normativo: row.id_documento,
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalData(null);
    if (typeof onRefresh === "function") {
      onRefresh();
    }
  };

  return (
    <>
      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          borderRadius: 4,
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.12)",
          border: "1px solid #2AAC67",
          px: 0,
          transition: "box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.18)",
          },
        }}
        component="nav"
      >
        {roles.map((role) => (
          <React.Fragment key={role.nombre_rol}>
            {/* Botón de cada rol */}
            <ListItemButton
              onClick={() => handleClick(role.nombre_rol)}
              sx={{
                py: 1.2,
                transition: "background-color 0.3s ease, transform 0.3s ease",
                "&:hover": {
                  backgroundColor: "#E6F3EA",
                  transform: "translateX(5px)",
                },
              }}
            >
              <ListItemText
                primary={role.nombre_rol}
                primaryTypographyProps={{
                  fontWeight: "bold",
                  color: "black",
                  letterSpacing: "0.5px",
                }}
              />
              {open[role.nombre_rol] ? (
                <ExpandLess sx={{ color: "#2AAC67" }} />
              ) : (
                <ExpandMore sx={{ color: "#2AAC67" }} />
              )}
            </ListItemButton>
            <Collapse in={!!open[role.nombre_rol]} timeout="auto" unmountOnExit>
              <TableContainer
                component={Paper}
                sx={{
                  my: 1,
                  mx: 2,
                  borderRadius: 3,
                  boxShadow: "0 3px 10px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #2AAC67",
                  animation: "fadeIn 0.5s ease-out",
                  "@keyframes fadeIn": {
                    "0%": { opacity: 0, transform: "translateY(10px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          color: "#2AAC67",
                          fontWeight: "bold",
                          letterSpacing: "0.5px",
                        }}
                      >
                        POE
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#2AAC67",
                          fontWeight: "bold",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Descripción
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#2AAC67",
                          fontWeight: "bold",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Versión
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#2AAC67",
                          fontWeight: "bold",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Fecha de inducción
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#2AAC67",
                          fontWeight: "bold",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Estado
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(role.poes || []).map((row, idx) => (
                      <TableRow
                        key={idx}
                        sx={{
                          transition: "background-color 0.3s ease",
                          "&:hover": {
                            backgroundColor: "#F0F8F2",
                          },
                        }}
                      >
                        <TableCell>{row.codigo}</TableCell>
                        <TableCell>{row.descripcion}</TableCell>
                        <TableCell>{row.version}</TableCell>
                        <TableCell>
                          {row.fecha_inicio
                            ? new Date(row.fecha_inicio).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {row.estado_capacitacion === "Capacitado" ? (
                              <CheckCircleIcon
                                sx={{ color: "#2AAC67", fontSize: "1.6rem" }}
                              />
                            ) : (
                              <>
                                <CancelIcon
                                  sx={{ color: "#e53935", fontSize: "1.6rem" }}
                                />
                                <Button
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  sx={{
                                    backgroundColor: "#2AAC67",
                                    "&:hover": { backgroundColor: "#1F8A50" },
                                    textTransform: "none",
                                    fontWeight: "bold",
                                    borderRadius: 2,
                                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                                    transition: "all 0.3s ease",
                                  }}
                                  onClick={() => handleOpenModal(row)}
                                >
                                  <EditDocumentIcon />
                                </Button>
                              </>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(role.poes || []).length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          align="center"
                          sx={{ color: "#888" }}
                        >
                          No hay registros de procedimientos para este rol.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
      {/* Modal de capacitación */}
      <TrainingModal
        open={modalOpen}
        onClose={handleCloseModal}
        initialData={modalData}
      />
    </>
  );
}
