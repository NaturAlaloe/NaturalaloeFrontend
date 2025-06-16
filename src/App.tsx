import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Drawer from './Drawer';
import CustomToaster from './components/globalComponents/CustomToaster';
import Login from './views/login/login';
import ChangePassword from './views/login/changePassword';
import RecoverPassword from './views/login/recoverPassword';

function isLoggedIn() {
  // Busca la cookie de sesión (ajusta el nombre si es diferente)
  const logged = document.cookie.split(';').some(c => c.trim().startsWith('session='));
  console.log("isLoggedIn() ->", logged, "| cookies:", document.cookie);
  return logged;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn());

  useEffect(() => {
    console.log("App mounted. isAuthenticated:", isAuthenticated);
    // Si la cookie cambia, podrías volver a chequear aquí
    // (opcional: para apps más avanzadas)
  }, []);

  const handleLoginSuccess = () => {
    console.log("Login exitoso, autenticando usuario...");
    setIsAuthenticated(true);
  };
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

  return (
    <>
      <CustomToaster />
      <BrowserRouter>
        {!isAuthenticated ? (
          <Routes>
            <Route path="/login/recoverPassword" element={<RecoverPassword />} />
            <Route path="/login/changePassword" element={<ChangePassword />} />
            <Route path="*" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          </Routes>
        ) : (
          <Drawer onLogout={handleLogout} />
        )}
      </BrowserRouter>
    </>
  );
}

export default App;