import { UserRepository } from "../../domain/interfaces";
import { NotFoundError } from "../../domain/errors";

export class ConfirmAccountUseCase {
    constructor(private readonly _userRepository: UserRepository) {}

    async execute(input: { token: string }): Promise<void> {
        // 1. Verificamos que el usuario exista
        const existingUser = await this._userRepository.findByToken(
            input.token
        );
        if (!existingUser) {
            throw new NotFoundError("Usuario no encontrado");
        }

        existingUser.confirmAccount();

        await this._userRepository.save(existingUser);
    }
}
