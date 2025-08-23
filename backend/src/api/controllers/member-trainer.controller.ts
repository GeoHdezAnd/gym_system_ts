import type { Request, Response, NextFunction } from "express";
import {
    SelectTrainerUseCase,
    GetRelationMemberTrainerUseCase,
    UpdateRelationUseCase,
} from "../../application/memberApp";
import {
    GetAdvisedUseCase,
    GetAllWorksoutUseCase,
} from "../../application/trainerApp";

export class MemberTrainerController {
    constructor(
        private readonly _selectTrainerUseCase: SelectTrainerUseCase,
        private readonly _getRelaionMemberTrainerUseCase: GetRelationMemberTrainerUseCase,
        private readonly _updateRelationUseCase: UpdateRelationUseCase,
        private readonly _getAdvisedUseCase: GetAdvisedUseCase,
        private readonly _getAllWorksoutUseCase: GetAllWorksoutUseCase
    ) {}

    // Ruta para obtener la relación segun el user id, lo buscara en la tabla de miembros
    async getByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const { memberId } = req.params;
            const relation = await this._getRelaionMemberTrainerUseCase.execute(
                memberId
            );

            res.json(relation);
        } catch (error) {
            next(error);
        }
    }

    // Ruta para traer los asesorados de cada entrenador segun su ID user
    async getAdvisedByTrainer(req: Request, res: Response, next: NextFunction) {
        try {
            const { trainerId } = req.params;
            const advised = await this._getAdvisedUseCase.execute(trainerId);
            res.json(advised);
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { memberId, trainerId } = req.body;
            await this._selectTrainerUseCase.execute(memberId, trainerId);
            res.json({ message: "Selección de entrenador correcta" });
        } catch (error) {
            next(error);
        }
    }

    async updateRelation(req: Request, res: Response, next: NextFunction) {
        try {
            const { relationId } = req.params;
            const { member_id, trainer_id, notes, goal, progress } = req.body;

            await this._updateRelationUseCase.execute({
                id: relationId,
                member_id,
                trainer_id,
                notes,
                goal,
                progress,
            });
            res.json({
                message: "Coaching actualizado",
            });
        } catch (error) {
            next(error);
        }
    }

    // Entrenamientos
    async getAllWorksout(req: Request, res: Response, next: NextFunction) {
        try {
            const { relationId } = req.params;
            const data = await this._getAllWorksoutUseCase.execute(relationId);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }

    async createWorkOut(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, start_date, end_date, exercises } = req.body;
            console.log(name, start_date, end_date, exercises);
            res.json({ message: "Rutina creada correctamente" });
        } catch (error) {
            next(error);
        }
    }
}
