import { useState } from "react";
import { addUser } from "../../services/users/addUserService";
import type { User } from "../../services/users/addUserService";
import axios from "axios";

const useAddUser = () => {
    const [newUser, setNewUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const insertUser = async (userData: User) => {
        try {

            setLoading(true);
            setError(null);
            setSuccess(false);
            const response = await addUser(userData);
            setNewUser(response.data);
            setSuccess(true);

        } catch (err) {

            if (axios.isAxiosError(err)) {

                if (err.response?.status === 409) {
                    setError("El correo electrónico ya está registrado.");
                } else {
                    setError("Ocurrió un error al registrar el usuario.");
                }
            } else {
                setError("Error inesperado al registrar el usuario.");
            }
            setNewUser(null);
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return { newUser, loading, error, success, insertUser };
};

export default useAddUser;
