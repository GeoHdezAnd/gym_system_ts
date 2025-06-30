import { UserRepository } from "../../domain/interfaces";
import { NotFoundError, UnauthorizedError } from "../../domain/errors";
import { IAuthService } from "../../domain/services";

export class UpdateCurrentPasswordUseCase {
    constructor(
        private readonly _userRepository: UserRepository,
        private readonly _authService: IAuthService
    ) {}
    async execute(input: {
        currentPassword: string;
        password: string;
        id: string;
    }): Promise<void> {
        // Verificamos si el usuario existe
        const user = await this._userRepository.findById(input.id);
        if (!user) {
            throw new NotFoundError("Usuario no encontrado");
        }

        const isPasswordCorrect = await this._authService.comparePassword(
            input.currentPassword,
            user.password
        );

        if (!isPasswordCorrect) {
            throw new UnauthorizedError("El password no es correcto");
        }

        const password = await this._authService.hashPassword(input.password);
        user.changePassword(password);
        await this._userRepository.save(user);
    }
}
