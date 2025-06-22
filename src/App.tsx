import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Drawer from './Drawer';
import CustomToaster from './components/globalComponents/CustomToaster';
import Login from './views/login/login';
import ChangePassword from './views/login/changePassword';
import RecoverPassword from './views/login/recoverPassword';
import api from './apiConfig/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Valida la sesión con el backend al montar la app
    const checkSession = async () => {
      console.log("Verificando sesión con el backend...");
      try {
        const res = await api.get('/auth/endpoint'); // Cambia '/me' por el endpoint real
        console.log("Sesión válida:", res.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.log("Sesión inválida o error:", err);
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
        console.log("Finalizó la verificación de sesión.");
      }
    };
    checkSession();
  }, []);

  const handleLogout = () => {
    console.log("Cerrando sesión...");
    setIsAuthenticated(false);
    // Opcional: limpiar la cookie si tu backend no lo hace
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log("Cookie de sesión eliminada. isAuthenticated:", isAuthenticated);
  };

  useEffect(() => {
    console.log("isAuthenticated cambió:", isAuthenticated);
  }, [isAuthenticated]);

  if (checkingAuth) {
    console.log("Verificando autenticación, mostrando loader...");
    return null; // O un loader/spinner
  }

  return (
    <>
      <CustomToaster />
      <BrowserRouter>
        {!isAuthenticated ? (
          <Routes>
            <Route path="/login/recoverPassword" element={<RecoverPassword />} />
            <Route path="/login/changePassword" element={<ChangePassword />} />
            <Route path="*" element={<Login onLoginSuccess={() => setIsAuthenticated(true)} />} />
          </Routes>
        ) : (
          <Drawer onLogout={handleLogout} />
        )}
      </BrowserRouter>
    </>
  );
}

export default App;