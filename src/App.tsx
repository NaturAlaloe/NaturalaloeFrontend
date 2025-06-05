import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Drawer from './Drawer';
import CustomToaster from './components/CustomToaster';
import Login from './views/login/login';
import ChangePassword from './views/login/changePassword';
import RecoverPassword from './views/login/recoverPassword';

function App() {
  // Estado de autenticación (puedes mejorarlo con contexto o redux)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función para manejar el login exitoso
  const handleLoginSuccess = () => setIsAuthenticated(true);

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
          <Drawer />
        )}
      </BrowserRouter>
    </>
  );
}

export default App;