import { useState, useEffect } from "react";
import { getResponsibles } from "../../services/responsibles/getResponsibles";

export function useResponsibles() {
  const [responsibles, setResponsibles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getResponsibles()
      .then((data) => setResponsibles(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { responsibles, loading, error };
}
