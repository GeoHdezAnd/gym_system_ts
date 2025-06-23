import { exitCode } from "process";
import { UserRepository } from "../../domain/interfaces";
import { NotFoundError, UnauthorizedError } from "../../domain/errors";
import { IAuthService, EmailService } from "../../domain/services";
import { createToken } from "../../utils";

export class ForgotPasswordUseCase {
    constructor(
        private userRepository: UserRepository,
        private authService: IAuthService,
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

        const token = createToken();

        existingUser.updateToken(token);
        await this.userRepository.save(existingUser);
        await this.emailService.sendPasswordResetEmail({
            name: `${existingUser.name} ${existingUser.last_name}`,
            email: existingUser.email,
            token: existingUser.token!,
        });
    }
}
