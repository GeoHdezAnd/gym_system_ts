export interface AuthService {
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string, hashedPassword: string): Promise<boolean>;
    generateToken(): string; // Para confirmación por email
    generateJWT(userId: string): string;
}
