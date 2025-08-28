import { AdminRepository, UserRepository } from "../../../domain/interfaces";
import { NotFoundError } from "../../../domain/errors";

type RequestAdmin = {
    name: string;
    last_name: string;
    email: string;
    phone: string;
    access_level: string;
};

export class UpdateAdminUseCase {
    constructor(
        private readonly _userRepository: UserRepository,
        private readonly _adminRepository: AdminRepository
    ) {}

    async execute(newData: RequestAdmin, adminId: string): Promise<void> {
        const userComplete = await this._userRepository.findById(adminId);

        if (!userComplete) {
            throw new NotFoundError("No se encontro el usuario");
        }

        userComplete.updateByAdmin(newData);
        await this._userRepository.save(userComplete);

        await this._adminRepository.save(newData.access_level, adminId);
        
    }
}
