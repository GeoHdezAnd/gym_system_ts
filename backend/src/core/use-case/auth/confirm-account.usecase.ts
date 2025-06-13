import { UserRepository } from "../../domain/interfaces";
import { NotFoundError } from "../../errors";

export class ConfirmAccountUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(input: { token: string }): Promise<void> {
        // 1. Verificamos que el usuario exista
        const existingUser = await this.userRepository.findByToken(input.token);
        if (!existingUser) {
            throw new NotFoundError('Usuario no encontrado');
        }

        existingUser.confirmAccount();

        await this.userRepository.save(existingUser);
    }
}
