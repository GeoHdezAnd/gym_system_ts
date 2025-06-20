import type { Request, Response, NextFunction } from "express";
import {
    CreateMemberUseCase,
    DeleteUserUseCase,
    GetAllMembersUseCase,
    UpdateMemberUseCase,
} from "../../application/admin/members";

export class MemberController {
    constructor(
        private createMemberUseCase: CreateMemberUseCase,
        private getAllMembersUseCase: GetAllMembersUseCase,
        private updateMemberUseCase: UpdateMemberUseCase,
        private deleteUserUseCase: DeleteUserUseCase
    ) {}

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const members = await this.getAllMembersUseCase.execute();
            res.json(members);
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            res.json(req.member);
        } catch (error) {
            next(error);
        }
    }
    async createMember(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, last_name, email, phone, gender, born_date } =
                req.body;
            const member = await this.createMemberUseCase.execute({
                name,
                lastName: last_name,
                email,
                phone,
                gender,
                bornDate: born_date,
            });
            res.status(201).json({
                message: "Miembro creado correctamente",
                member,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateMemberById(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, last_name, email, phone, gender, born_date } =
                req.body;
            await this.updateMemberUseCase.execute(
                {
                    name,
                    lastName: last_name,
                    email,
                    phone,
                    gender,
                    bornDate: born_date,
                },
                req.member!.id
            );
            res.json({ message: "Miembro actualizado" });
        } catch (error) {
            next(error);
        }
    }

    async deleteMemberById(req: Request, res: Response, next: NextFunction) {
        try {
            const memberId = req.member?.id!;
            await this.deleteUserUseCase.execute(memberId);
            res.json({ message: "Usuario eliminado con soft deleted" });
        } catch (error) {
            next(error);
        }
    }
}
