import { useState, useEffect } from "react";
import api from "../config/axios";
import { AuthContext, type User } from "./auth-context";

// Props para el provider
interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [auth, setAuth] = useState<User | undefined>(undefined);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const autenticarUsuario = async () => {
            const token = localStorage.getItem("AUTH_TOKEN");
            if (!token) {
                setIsAuthenticated(false);
                return;
            }

            try {
                const { data } = await api.get<User>("/auth/user");
                setAuth(data);
                setIsAuthenticated(true);
            } catch (error) {
                console.log("Error:", error);
                localStorage.removeItem("AUTH_TOKEN");
                setAuth(undefined);
                setIsAuthenticated(false);
            }
        };
        autenticarUsuario();
    }, []);

    const signIn = async (token: string) => {
        localStorage.setItem("AUTH_TOKEN", token);

        try {
            const { data } = await api.get<User>("/auth/user");
            setAuth(data);
            setIsAuthenticated(true); // <-- Actualiza el estado primero
            return true; // <-- Retorna éxito
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const logOut = () => {
        localStorage.removeItem("AUTH_TOKEN");
        setIsAuthenticated(false);
        setAuth(undefined);
    };

    return (
        <AuthContext.Provider value={{ auth, isAuthenticated, signIn, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};
