import { useState, useEffect } from "react";
import { getCollaborators } from "../../services/collaborators/getCollaboratorsService";
import type { Collaborator } from "../../services/collaborators/getCollaboratorsService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

const useGetCollaborators = () => {
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCollaborators = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCollaborators();
            setCollaborators(data);
        } catch (err) {
            showCustomToast("Error", "No se pudieron cargar los colaboradores.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCollaborators();
    }, []);

    return { collaborators, loading, error, refetch: fetchCollaborators };
};

export default useGetCollaborators;
