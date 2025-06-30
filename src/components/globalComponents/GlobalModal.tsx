import { Dialog, DialogContent, DialogActions, IconButton, Typography, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

interface CenteredTitleModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  backgroundColor?: string; // <-- Nueva prop
}

export default function GlobalModal({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = "md",
  fullWidth = true,
  backgroundColor = "#fff", // <-- Valor por defecto
}: CenteredTitleModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          backgroundColor: backgroundColor, // <-- Usa la prop aquí
        },
      }}
      BackdropProps={{
        style: {
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(0,0,0,0.3)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2AAC67",
          px: 2,
          pt: 2,
          pb: 1,
        }}
      >
        <Box sx={{ flex: 1, textAlign: "center", pl: 5 }}>
          <Typography variant="h6" fontWeight={700} color="#fff">
            {title}
          </Typography>
        </Box>
        <IconButton
          edge="end"
          onClick={onClose}
          aria-label="close"
          sx={{
            ml: 2,
            color: "#fff",
            background: "",
            "&:hover": { background: "#" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent dividers>{children}</DialogContent>
      {actions && (
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
}