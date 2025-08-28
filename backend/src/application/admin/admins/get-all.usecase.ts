import { IAdminWithUserDto } from "../../../domain/dtos/admin.dto";
import { AdminRepository } from "../../../domain/interfaces";

export class GetAllAdminsUseCase {
    constructor(private readonly _adminRepostory: AdminRepository) {}

    async execute(): Promise<IAdminWithUserDto[] | []> {
        const admins = await this._adminRepostory.getAll();
        return admins;
    }
}
