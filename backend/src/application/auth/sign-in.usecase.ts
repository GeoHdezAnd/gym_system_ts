import { UserRepository } from "../../domain/interfaces";
import {
    NotFoundError,
    ForbiddenError,
    UnauthorizedError,
} from "../../domain/errors";
import { IAuthService } from "../../domain/services";

/**
 * Caso de uso para iniciar sesión de usuario.
 *
 * - Verifica que el usuario exista y esté confirmado.
 * - Valida la contraseña y controla los intentos fallidos.
 * - Genera y retorna un JWT si la autenticación es exitosa.
 *
 * @param email Correo electrónico del usuario.
 * @param password Contraseña del usuario.
 * @returns JWT de autenticación.
 * @throws NotFoundError, ForbiddenError, UnauthorizedError según el caso.
 */
export class SignInUseCase {
    constructor(
        private readonly _userRepository: UserRepository,
        private readonly _authService: IAuthService
    ) {}

    /**
     * Ejecuta el inicio de sesión.
     */
    async execute(email: string, password: string): Promise<string> {
        const user = await this.grantedUserOrFail(email, password);

        user.resetLoginAttempts();
        await this._userRepository.save(user);

        return this._authService.generateJWT(user.id!);
    }
    /**
     * Verifica que el usuario pueda ingresar.
     * - Que exista
     * - Que este confirmado
     * - Que tenga credenciales validas
     */
    private async grantedUserOrFail(email: string, password: string) {
        const user = await this._userRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundError("Usuario no existe");
        }

        if (!user.confirmed) {
            throw new ForbiddenError("El usuario no está confirmado");
        }

        const isPasswordCorrect = await this._authService.comparePassword(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            user.incrementLoginAttempts();
            
            await this._userRepository.save(user);

            throw new UnauthorizedError("Credenciales invalidas");
        }

        return user;
    }
}
