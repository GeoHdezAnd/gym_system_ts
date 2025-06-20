import { UserRepository } from "../../../domain/interfaces";
import { NotFoundError } from "../../../domain/errors";

export class DeleteUserUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(memberId: string): Promise<void> {
        //
        const user = await this.userRepository.findById(memberId);
        if (!user) {
            throw new NotFoundError("Usuario no encontrado");
        }

        user.deleteAccount();

        await this.userRepository.save(user);
    }
}
