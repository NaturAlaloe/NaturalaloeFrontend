import { useEffect, useState } from "react";
import {
  getFacilitadores,
  type Facilitador,
} from "../../services/manage/collaboratorFacilitatorService";

export default function useCollaboratorFacilitator() {
  const [facilitadores, setFacilitadores] = useState<Facilitador[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    getFacilitadores()
      .then((data) => setFacilitadores(data))
      .finally(() => setLoading(false));
  }, []);

  const nombres = facilitadores.map((f) =>
    `${f.nombre} ${f.apellido1} ${f.apellido2}`.trim()
  );

  return { facilitadores, nombres, loading };
}
