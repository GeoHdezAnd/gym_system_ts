import { UserRepository } from "../../domain/interfaces";
import { NotFoundError } from "../../errors";
import { AuthService } from "../../services";

export class ResetPasswordWTokenUseCase {
    constructor(
        private userRepository: UserRepository,
        private authService: AuthService
    ) {}

    async execute(input: { token: string; password: string }): Promise<void> {
        const user = await this.userRepository.findByToken(input.token);
        if (!user) {
            throw new NotFoundError("Token no válido");
        }

        const hash = await this.authService.hashPassword(input.password);

        user.changePassword(hash);

        await this.userRepository.save(user);
    }
}
