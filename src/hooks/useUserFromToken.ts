import { useEffect, useState } from "react";
import api from "../apiConfig/api";


interface UserData {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: UserData;
}

export function useUserFromToken() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await api.get<AuthResponse>('/auth/endpoint');
        
        if (response.data.success) {
          setUserData(response.data.data);
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  return {
    user: userData,
    loading,
    nombre: userData?.nombre || null,
    apellido: userData?.apellido || null,
    email: userData?.email || null,
    fullName: userData ? `${userData.nombre} ${userData.apellido}` : null
  };
}