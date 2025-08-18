import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Drawer from './Drawer';
import CustomToaster from './components/globalComponents/CustomToaster';
import Login from './views/login/login';
import ChangePassword from './views/login/changePassword';
import RecoverPassword from './views/login/recoverPassword';
import TokenExpiredModal from './components/modals/TokenExpiredModal';
import ForceChangePasswordModal from './components/modals/ForceChangePasswordModal';
import api from './apiConfig/api';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showTokenExpiredModal, setShowTokenExpiredModal] = useState(false);
  const [showForceChangePasswordModal, setShowForceChangePasswordModal] = useState(false);
  const [, setUserData] = useState(null);

  // Verifica sesión y cambio_contrasena cada vez que la app carga
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get('/auth/endpoint');
        setIsAuthenticated(true);
        setUserData(res.data?.data || null);
        // Si cambio_contrasena === 1, mostrar modal
        if (res.data?.data?.cambio_contrasena === 1) {
          setShowForceChangePasswordModal(true);
        } else {
          setShowForceChangePasswordModal(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
        setUserData(null);
        setShowForceChangePasswordModal(false);
      } finally {
        setCheckingAuth(false);
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
      setUserData(null);
      setShowForceChangePasswordModal(false);
    };
    window.addEventListener('tokenExpired', handleTokenExpired);
    return () => {
      window.removeEventListener('tokenExpired', handleTokenExpired);
    };
  }, [isAuthenticated]);

  const handleLoginSuccess = async () => {
    setIsAuthenticated(true);
    try {
      const res = await api.get('/auth/endpoint');
      setUserData(res.data?.data || null);
      if (res.data?.data?.cambio_contrasena === 1) {
        setShowForceChangePasswordModal(true);
      } else {
        setShowForceChangePasswordModal(false);
      }
    } catch (err) {
      setUserData(null);
      setShowForceChangePasswordModal(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (e) {
      console.error("Error al cerrar sesión:", e);
    }
    setIsAuthenticated(false);
    setUserData(null);
    setShowForceChangePasswordModal(false);

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
            <Route path="*" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          </Routes>
        ) : (
          <Drawer onLogout={handleLogout} />
        )}
      </BrowserRouter>
      {/* Modal de cambio de contraseña forzado */}
      <ForceChangePasswordModal
        isOpen={showForceChangePasswordModal}
        onLogout={handleLogout}
      />
      <TokenExpiredModal
        isOpen={showTokenExpiredModal}
        onClose={handleCloseTokenExpiredModal}
      />
    </>
  );
}

export default App;