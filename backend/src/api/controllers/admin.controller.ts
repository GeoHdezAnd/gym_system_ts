import type { Request, Response, NextFunction } from "express";
import {
    GetAllAdminsUseCase,
    UpdateAdminUseCase,
} from "../../application/admin/admins";
import { DeleteUserUseCase } from "../../application/admin/members";
export class AdminController {
    constructor(
        private readonly _getAllAdminsUseCase: GetAllAdminsUseCase,
        private readonly _deleteUserUseCase: DeleteUserUseCase,
        private readonly _updateAdminUseCase: UpdateAdminUseCase
    ) {}

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const admins = await this._getAllAdminsUseCase.execute();
            res.json(admins);
        } catch (error) {
            next(error);
        }
    }

    async getAdminById(req: Request, res: Response, next: NextFunction) {
        try {
            res.json(req.admin);
        } catch (error) {
            next(error);
        }
    }

    async updateAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const { adminId } = req.params;
            const { name, last_name, email, phone, access_level } = req.body;
            await this._updateAdminUseCase.execute(
                { name, last_name, email, phone, access_level },
                adminId
            );
            res.json("Admin actualizado");
        } catch (error) {
            next(error);
        }
    }

    async deleteAdminById(req: Request, res: Response, next: NextFunction) {
        try {
            const { adminId } = req.params;
            await this._deleteUserUseCase.execute(adminId);
            res.json({ message: "Admin eliminado con soft delete" });
        } catch (error) {
            next(error);
        }
    }
}
