import { UserRepository } from "../../domain/interfaces";
import { NotFoundError } from "../../domain/errors";

export class ValidateTokenUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(token: string): Promise<void> {
        const tokenExists = await this.userRepository.findByToken(token);
        if (!tokenExists) {
            throw new NotFoundError("Usuario no encontrado");
        }
    }
}
