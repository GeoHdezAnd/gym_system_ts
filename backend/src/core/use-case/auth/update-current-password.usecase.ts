import { UserRepository } from "../../domain/interfaces";
import { NotFoundError, UnauthorizedError } from "../../errors";
import { AuthService } from "../../services";

export class UpdateCurrentPasswordUseCase {
    constructor(
        private userRepository: UserRepository,
        private authService: AuthService
    ) {}
    async execute(input: {
        currentPassword: string;
        password: string;
        id: string;
    }): Promise<void> {
        // Verificamos si el usuario existe
        const user = await this.userRepository.findById(input.id);
        if (!user) {
            throw new NotFoundError("Usuario no encontrado");
        }

        const isPasswordCorrect = await this.authService.comparePassword(
            input.currentPassword,
            user.password
        );

        if (!isPasswordCorrect) {
            throw new UnauthorizedError("El password no es correcto");
        }

        const password = await this.authService.hashPassword(input.password);
        user.changePassword(password);
        await this.userRepository.save(user);
    }
}
