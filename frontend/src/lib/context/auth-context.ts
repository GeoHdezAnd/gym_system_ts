import { createContext } from "react";

// Tipos para el contexto
export type User = {
    name: string;
    lastName: string;
    email?: string;
    role?: string;
};

export interface AuthContextType {
    auth: User | undefined;
    isAuthenticated: boolean;
    signIn: (token: string) => Promise<boolean>;
    cerrarSesion: () => void;
}

// Creación del contexto con valor inicial tipado
export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);
