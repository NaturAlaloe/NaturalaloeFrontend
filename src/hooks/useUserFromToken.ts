import { useMemo } from "react";

export function useUserFromToken() {
  return useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.tokenPayload || null;
    } catch {
      return null;
    }
  }, []);
}