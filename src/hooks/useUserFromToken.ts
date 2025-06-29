import { useMemo } from "react";

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function useUserFromToken() {
  return useMemo(() => {
    const token = getCookie("token");
    console.log("JWT token from cookie:", token);
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("Decoded JWT payload:", payload);
      return payload.tokenPayload || null;
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  }, []);
}