import { UserRepository } from "../../domain/interfaces";
import {
    NotFoundError,
    ForbiddenError,
    UnauthorizedError,
} from "../../domain/errors";
import { AuthService } from "../../domain/services";

export class SignInUseCase {
    constructor(
        private userRepository: UserRepository,
        private authService: AuthService
    ) {}

    async execute(email: string, password: string): Promise<string> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundError("Usuario no existe");
        }

        if (!user.confirmed) {
            throw new ForbiddenError("El usuario no está confirmado");
        }

        if (user.login_attempts && user.login_attempts >= 5) {
            throw new UnauthorizedError(
                "Excediste los intentos de inicio de sesión, solicita cambio de contraseña"
            );
        }

        const isPasswordCorrect = await this.authService.comparePassword(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            user.incrementLoginAttempts();
            await this.userRepository.save(user);
            throw new UnauthorizedError("La contraseña no coincide");
        }

        if (!user.id) {
            throw new NotFoundError("No existe el usuario");
        }

        const token = this.authService.generateJWT(user.id);
        return token;
    }
}
