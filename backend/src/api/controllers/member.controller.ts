import type { Request, Response, NextFunction } from "express";
import {
    CreateMemberUseCase,
    DeleteUserUseCase,
    GetAllMembersUseCase,
    UpdateMemberUseCase,
} from "../../application/admin/members";

/**
 * Operaciones para los miembros donde el admin es el unico que puede hacer cambios
 */
export class MemberController {
    constructor(
        private readonly _createMemberUseCase: CreateMemberUseCase,
        private readonly _getAllMembersUseCase: GetAllMembersUseCase,
        private readonly _updateMemberUseCase: UpdateMemberUseCase,
        private readonly _deleteUserUseCase: DeleteUserUseCase
    ) {}

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = (req.query.search as string) || undefined;
            const result = await this._getAllMembersUseCase.execute(
                page,
                limit,
                search
            );

            res.json({
                success: true,
                members: result.members,
                pagination: {
                    total: result.total,
                    pages: result.pages,
                    currentPage: result.currentPage,
                    perPage: limit,
                },
            });
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
            const member = await this._createMemberUseCase.execute({
                name,
                last_name,
                email,
                phone,
                gender,
                born_date,
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
            await this._updateMemberUseCase.execute(
                {
                    name,
                    last_name,
                    email,
                    phone,
                    gender,
                    born_date,
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
            await this._deleteUserUseCase.execute(memberId);
            res.json({ message: "Usuario eliminado con soft deleted" });
        } catch (error) {
            next(error);
        }
    }

    async deleteMemberBatch(req: Request, res: Response, next: NextFunction) {
        try {
            const { userIds } = req.body;
            if (!Array.isArray(userIds) || userIds.length === 0) {
                res.status(400).json({
                    message: "Debes enviar un array de ids",
                });
                return;
            }

            await this._deleteUserUseCase.executeBath(userIds);
            res.json({ message: "Usuarios eliminados correctamente" });
        } catch (error) {
            next(error);
        }
    }
}
