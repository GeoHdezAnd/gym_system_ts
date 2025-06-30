import { UserRepository } from "../../domain/interfaces";
import { NotFoundError, UnauthorizedError } from "../../domain/errors";
import { EmailService } from "../../domain/services";
import { createToken } from "../../utils";

/**
 * Caso de uso para recuperación de contraseña.
 *
 * - Verifica que el usuario exista y esté confirmado.
 * - Genera un token de recuperación y lo guarda en el usuario.
 * - Envía un email con instrucciones para restablecer la contraseña.
 *
 * @param email Correo electrónico del usuario.
 * @throws NotFoundError si el usuario no existe.
 * @throws UnauthorizedError si el usuario no está confirmado.
 */
export class ForgotPasswordUseCase {
    constructor(
        private readonly _userRepository: UserRepository,
        private readonly _emailService: EmailService
    ) {}

    /**
     * Ejecuta el flujo de recuperación de contraseña.
     */
    async execute(email: string): Promise<void> {
        // 1. verificamos si el email existe
        const existingUser = await this._userRepository.findByEmail(email);
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
        await this._userRepository.save(existingUser);
        await this._emailService.sendPasswordResetEmail({
            name: `${existingUser.name} ${existingUser.last_name}`,
            email: existingUser.email,
            token: existingUser.token!,
        });
    }
}
