
import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import type { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import HomeIcon from "@mui/icons-material/Home";
import ArticleIcon from "@mui/icons-material/Article";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import HandymanIcon from "@mui/icons-material/Handyman";
import Collapse from "@mui/material/Collapse";
import GroupIcon from "@mui/icons-material/Group";
import { Routes, Route, Link } from "react-router-dom";
import HomeScreen from "./views/home/HomeScreen";
import Procedimientos from "./views/procedures/procedures";
import ListaProcedimientos from "./views/procedures/listProcedures";
import Capacitaciones from "./views/capacitation/capacitacion";
import ListaCapacitaciones from "./views/capacitation/listCapacitation";
import Colaboradores from "./views/collaborators/collaborators";
import CollaboratorDetail from "./views/collaborators/CollaboratorDetail";
import RegistroFacilitadores from "./views/capacitation/facilitatorTraining";
import CapacitacionFinalizada from "./views/capacitation/capacitationFinished";
import AddCollaborator from "./views/collaborators/addCollaborator";
import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import Profile from "./views/profile/profile";
import Register from "./views/login/register";
import UserAssignment from "./views/login/userAssignment";
import SchoolIcon from '@mui/icons-material/School';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import Politicies from './views/politics/politicsForm';


const drawerWidth = 270;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  backgroundColor: "#2AAC67",
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  ...theme.mixins.toolbar,
}));

const drawerBg = `linear-gradient(to bottom,rgb(23, 134, 75) 0%,rgb(42, 172, 103) 100%)`;
export default function PersistentDrawerLeft() {
  const [open, setOpen] = React.useState(false);

  // Estados para submenús

  const [openLogin, setOpenLogin] = React.useState(false);
  const [openProcedimientos, setOpenProcedimientos] = React.useState(false);
  const [openPoliticas, setOpenPoliticas] = React.useState(false);
  const [openCapacitaciones, setOpenCapacitaciones] = React.useState(false);
  const [openColaboradores, setOpenColaboradores] = React.useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[{ mr: 2 }, open && { display: "none" }]}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background: drawerBg,
            color: "#f4fcec",
            border: "none",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 2px 24px 0 #304328",
            // Scrollbar personalizado:
            "& *::-webkit-scrollbar": {
              width: "8px",
              background: "transparent",
            },
            "& *::-webkit-scrollbar-thumb": {
              background: "#fff",
              borderRadius: "8px",
            },
            "& *::-webkit-scrollbar-thumb:hover": {
              background: "#ccc",
            },
            "& *::-webkit-scrollbar-track": {
              background: "transparent",
            },
            // Firefox
            scrollbarWidth: "thin",
            scrollbarColor: "#ccc transparent",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 3,
            pb: 1,
          }}
        >
          <IconButton
            onClick={handleDrawerClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "#fff",
              "&:hover": { background: "#21824f", color: "#13bd62" },
              width: 46,
              height: 46,
              zIndex: 1,
            }}
            size="small"
            aria-label="Cerrar menú"
          >
            <ChevronLeftIcon />
          </IconButton>
          <AccountCircleIcon
            sx={{ fontSize: 48, color: "#ddebd7", mb: 1, mt: 1 }}
          />
          <Box sx={{ fontWeight: "bold", color: "#fff", fontSize: 18, mt: 1 }}>
            Emerson Duarte
          </Box>
        </Box>
        <Divider sx={{ borderColor: "#fff", opacity: 0.7, my: 2, mx: 0 }} />
        <List sx={{ flex: 1, px: 0 }}>
          {/* Dashboard */}
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/"
              sx={{
                color: "#fff",
                pl: 3,
                "&:hover": {
                  background: "#21824f",
                  color: "#fff",
                  "& .MuiSvgIcon-root": { color: "#09984c" },
                },
              }}
            >
              <HomeIcon sx={{ color: "#b4ebce", mr: 2 }} />
              <ListItemText primary="Inicio" />
            </ListItemButton>
          </ListItem>
          {/*  perfil */}
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/profile"
              sx={{
                color: "#fff",
                pl: 3,
                "&:hover": {
                  background: "#21824f",
                  color: "#fff",
                  "& .MuiSvgIcon-root": { color: "#13bd62" },
                },
              }}
            >
              <AccountCircleIcon sx={{ color: "#b4ebce", mr: 2 }} />
              <ListItemText primary="Perfil" />
            </ListItemButton>
          </ListItem>

          {/* Administración */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => setOpenLogin(!openLogin)}
              sx={{
                color: "#fff",
                pl: 3,
                "&:hover": {
                  background: "#21824f",
                  color: "#fff",
                  "& .MuiSvgIcon-root": { color: "#13bd62" },
                },
              }}
            >
              <HandymanIcon sx={{ color: "#b4ebce", mr: 2 }} />
              <ListItemText primary="Administración" />
              {openLogin ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>

          <Collapse in={openLogin} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                component={Link}
                to="/login/register"
                sx={{
                  pl: 6,
                  color: "#f4fcec",
                  "&:hover": {
                    background: "#2AAC67",
                    color: "#fff",
                  },
                }}
              >
                <ListItemText primary="Registrar Usuarios" />
              </ListItemButton>

              {/*
    <ListItemButton
      component={Link}
      to="/login/userAssignment"
      sx={{
        pl: 6,
        color: '#f4fcec',
        '&:hover': {
          background: '#2AAC67',
          color: '#fff',
        },
      }}
    >
      <ListItemText primary="Asignación de Usuario" />
    </ListItemButton>
    */}
            </List>
          </Collapse>
          

          {/* Procedimientos */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => setOpenProcedimientos(!openProcedimientos)}
              sx={{
                color: "#fff",
                pl: 3,
                "&:hover": {
                  background: "#21824f",
                  color: "#fff",
                  "& .MuiSvgIcon-root": { color: "#13bd62" },
                },
              }}
            >
              <ArticleIcon sx={{ color: "#b4ebce", mr: 2 }} />
              <ListItemText primary="Procedimientos" />
              {openProcedimientos ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openProcedimientos} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                component={Link}
                to="/procedures"
                sx={{
                  pl: 6,
                  color: "#f4fcec",
                  "&:hover": {
                    background: "#2AAC67",
                    color: "#fff",
                  },
                }}
              >
                <ListItemText primary="Agregar Procedimientos" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/procedures/listProcedures"
                sx={{
                  pl: 6,
                  color: "#f4fcec",
                  "&:hover": {
                    background: "#2AAC67",
                    color: "#fff",
                  },
                }}
              >
                <ListItemText primary="Listado" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Políticas */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => setOpenPoliticas(!openPoliticas)}
              sx={{
              color: '#fff',
              pl: 3,
              '&:hover': {
                background: '#21824f',
                color: '#fff',
                '& .MuiSvgIcon-root': { color: '#13bd62' },
              },
              }}
            >
              <ArticleIcon sx={{ color: '#b4ebce', mr: 2 }} />
              <ListItemText primary="Políticas" />
              {openPoliticas ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openPoliticas} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                component={Link}
                to="/politics/politicsForm"
                sx={{
                  pl: 6,
                  color: '#f4fcec',
                  '&:hover': {
                    background: '#2AAC67',
                    color: '#fff',
                  },
                }}
              >
                <ListItemText primary="Agregar Políticas" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Capacitaciones */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => setOpenCapacitaciones(!openCapacitaciones)}
              sx={{
                color: "#fff",
                pl: 3,
                "&:hover": {
                  background: "#21824f",
                  color: "#fff",
                  "& .MuiSvgIcon-root": { color: "#13bd62" },
                },
              }}
            >
              <SchoolIcon sx={{ color: "#b4ebce", mr: 2 }} />
              <ListItemText primary="Capacitaciones" />
              {openCapacitaciones ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openCapacitaciones} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                component={Link}
                to="/capacitation"
                sx={{
                  pl: 6,
                  color: "#f4fcec",
                  "&:hover": {
                    background: "#2AAC67",
                    color: "#fff",
                  },
                }}
              >
                <LibraryAddIcon sx={{ color: "#b4ebce", mr: 2 }} />
                <ListItemText primary="Agregar Capacitaciones" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/capacitation/facilitatorTraining"
                sx={{
                  pl: 6,
                  color: "#f4fcec",
                  "&:hover": {
                    background: "#2AAC67",
                    color: "#fff",
                  },
                }}
              >
                <PersonAddIcon sx={{ color: "#b4ebce", mr: 2 }} />
                <ListItemText primary="Agregar Facilitadores" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/capacitation/listCapacitation"
                sx={{
                  pl: 6,
                  color: "#f4fcec",
                  "&:hover": {
                    background: "#2AAC67",
                    color: "#fff",
                  },
                }}
              >
                <FormatListBulletedIcon sx={{ color: "#b4ebce", mr: 2 }} />
                <ListItemText primary="Lista" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/capacitation/capacitationIndividualFinished"
                sx={{
                  pl: 6,
                  color: "#f4fcec",
                  "&:hover": {
                    background: "#2AAC67",
                    color: "#fff",
                  },
                }}
              >
                <AssignmentTurnedInIcon sx={{ color: "#b4ebce", mr: 2 }} />
                <ListItemText primary="Finalizadas" />
              </ListItemButton>

            </List>
          </Collapse>

          {/* Colaboradores */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => setOpenColaboradores(!openColaboradores)}
              sx={{
                color: "#fff",
                pl: 3,
                "&:hover": {
                  background: "#21824f",
                  color: "#fff",
                  "& .MuiSvgIcon-root": { color: "#13bd62" },
                },
              }}
            >
              <GroupIcon sx={{ color: "#b4ebce", mr: 2 }} />
              <ListItemText primary="Colaboradores" />
              {openColaboradores ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openColaboradores} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                component={Link}
                to="/collaborators/addCollaborator"
                sx={{
                  pl: 6,
                  color: "#f4fcec",
                  "&:hover": {
                    background: "#2AAC67",
                    color: "#fff",
                  },
                }}
              >
                <ListItemText primary="Añadir Colaborador" />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="/collaborators/collaborators"
                sx={{
                  pl: 6,
                  color: "#f4fcec",
                  "&:hover": {
                    background: "#2AAC67",
                    color: "#fff",
                  },
                }}
              >
                <ListItemText primary="Buscar Colaboradores" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
        {/* Divider bien posicionado antes del botón */}
        <Divider sx={{ borderColor: "#fff", opacity: 0.7, my: 2, mx: 0 }} />
        {/* Botón cerrar sesión abajo, diseño destacado */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Box
            component="button"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              border: "none",
              borderRadius: 2,
              px: 3,
              py: 1.2,
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: 1,
              cursor: "pointer",
              background: "#2AAC67",
              color: "#fff",
              boxShadow: "none",
              transition: "background 0.2s, color 0.2s",
              "&:hover": {
                background: "#1d854e",
                color: "#fff",
              },
            }}
            onClick={() => {
              // Aquí puedes poner tu lógica de logout
              window.location.replace("/login"); // Redirigir al login
            }}
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M16 13v-2H7V8l-5 4 5 4v-3zM20 3h-8c-1.1 0-2 .9-2 2v4h2V5h8v14h-8v-4h-2v4c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
              />
            </svg>
            Cerrar sesión
          </Box>
        </Box>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Routes>
          <Route path="/login/register" element={<Register />} />
          <Route path="/login/userAssignment" element={<UserAssignment />} />
          <Route path="/" element={<HomeScreen />} />
          <Route path="/procedures" element={<Procedimientos />} />
          <Route
            path="/procedures/listProcedures"
            element={<ListaProcedimientos />}
          />
          <Route path="/capacitation/" element={<Capacitaciones />} />
          <Route
            path="/capacitation/listCapacitation"
            element={<ListaCapacitaciones />}
          />
          <Route
            path="/collaborators/collaborators"
            element={<Colaboradores />}
          />

          <Route
            path="/collaborators/detail"
            element={<CollaboratorDetail />}
          />

          <Route
            path="/capacitation/facilitatorTraining"
            element={<RegistroFacilitadores />}
          />
          <Route
            path="/capacitation/capacitationIndividualFinished"
            element={<CapacitacionFinalizada />}
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/collaborators/addCollaborator" element={<AddCollaborator />} />
          <Route path="/politics/politicsForm" element={<Politicies />} />


        </Routes>
      </Main>
    </Box>
  );
}
