import type { Request, Response, NextFunction } from "express";
import {
    CreateTrainerUseCase,
    GetAllTrainersUseCase,
    UpdateTrainerUseCase,
} from "../../application/admin/trainer";
import { DeleteUserUseCase } from "../../application/admin/members";

export class TrainerController {
    constructor(
        private readonly _createTrainerUseCase: CreateTrainerUseCase,
        private readonly _getAllTrainersUseCase: GetAllTrainersUseCase,
        private readonly _deleteUserUseCase: DeleteUserUseCase,
        private readonly _updateTrainerUseCase: UpdateTrainerUseCase
    ) {}

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const trainers = await this._getAllTrainersUseCase.execute();
            res.json(trainers);
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            res.json(req.trainer);
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, last_name, email, phone, bio, skills } = req.body;
            const trainer = await this._createTrainerUseCase.execute({
                name,
                last_name,
                email,
                phone,
                bio,
                skills,
            });

            res.json({
                message: "Entrenador creado, pide que revise su email",
                trainer,
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, last_name, email, phone, bio, skills } = req.body;
            await this._updateTrainerUseCase.execute(
                { name, last_name, email, phone, bio, skills },
                req.trainer!.id
            );

            res.json({ message: "Entrenador actualizado" });
        } catch (error) {
            next(error);
        }
    }

    async deleteTrainerById(req: Request, res: Response, next: NextFunction) {
        try {
            const trainerId = req.trainer?.id!;
            await this._deleteUserUseCase.execute(trainerId);
            res.json({ message: "Usuario eliminado con soft deleted" });
        } catch (error) {
            next(error);
        }
    }
}
