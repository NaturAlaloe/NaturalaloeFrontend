import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Drawer from './Drawer';
import CustomToaster from './components/globalComponents/CustomToaster';
import Login from './views/login/login';
import ChangePassword from './views/login/changePassword';
import RecoverPassword from './views/login/recoverPassword';
import TokenExpiredModal from './components/modals/TokenExpiredModal';
import api from './apiConfig/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showTokenExpiredModal, setShowTokenExpiredModal] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      console.log("Verificando sesión con el backend...");
      try {
        const res = await api.get('/auth/endpoint'); 
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

  // Listener para el evento de token expirado
  useEffect(() => {
    const handleTokenExpired = () => {
      if (isAuthenticated) {
        setShowTokenExpiredModal(true);
      }
      setIsAuthenticated(false);
    };

    window.addEventListener('tokenExpired', handleTokenExpired);
    
    return () => {
      window.removeEventListener('tokenExpired', handleTokenExpired);
    };
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (e) {
      console.error("Error al cerrar sesión:", e);
    }
    setIsAuthenticated(false);
    console.log("Sesión cerrada.");
  };

  const handleCloseTokenExpiredModal = () => {
    setShowTokenExpiredModal(false);
  };

  if (checkingAuth) {
    return null; 
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
      

      <TokenExpiredModal 
        isOpen={showTokenExpiredModal} 
        onClose={handleCloseTokenExpiredModal} 
      />
    </>
  );
}

export default App;