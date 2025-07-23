import { useState, useEffect } from "react";
import { getUsers , type User} from "../../services/users/getUsersService";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

const useGetUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            showCustomToast("Error", "No se pudieron cargar los usuarios.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return { users, loading, error, fetchUsers };
};

export default useGetUsers;
