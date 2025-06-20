import { UserRepository } from "../../domain/interfaces";
import { NotFoundError } from "../../domain/errors";
import { UnauthorizedError } from "../../domain/errors/unauthorized.error";
import { AuthService } from "../../domain/services";

export class CheckPasswordUseCase {
    constructor(
        private userRepository: UserRepository,
        private authService: AuthService
    ) {}

    async execute(password: string, id: string): Promise<void> {
        // 1. Validar que el usuario exista
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundError("Usuario no encontrado");
        }

        const isPasswordCorrect = await this.authService.comparePassword(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            throw new UnauthorizedError("Password incorrecto");
        }
    }
}
