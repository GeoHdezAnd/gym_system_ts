import { exitCode } from "process";
import { UserRepository } from "../../domain/interfaces";
import { NotFoundError, UnauthorizedError } from "../../errors";
import { AuthService, EmailService } from "../../services";

export class ForgotPasswordUseCase {
    constructor(
        private userRepository: UserRepository,
        private authService: AuthService,
        private emailService: EmailService
    ) {}

    async execute(input: { email: string }): Promise<void> {
        // 1. verificamos si el email existe
        const existingUser = await this.userRepository.findByEmail(input.email);
        if (!existingUser) {
            throw new NotFoundError("El usuario no se encontro");
        }

        if (!existingUser.confirmed) {
            throw new UnauthorizedError(
                "No puedes cambiar contraseña sin haber confirmado tu cuenta"
            );
        }

        const token = this.authService.generateToken();

        existingUser.updateToken(token);
        await this.userRepository.save(existingUser);
        await this.emailService.sendPasswordResetEmail({
            name: `${existingUser.name} ${existingUser.lastName}`,
            email: existingUser.email,
            token: existingUser.token!,
        });
    }
}
