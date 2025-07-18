import type { Request, Response, NextFunction } from "express";
import { CreateTrainerUseCase } from "../../application/admin/trainer";
import { GetAllTrainersUseCase } from "../../application/admin/trainer/get-all-trainer.usecase";

export class TrainerController {
    constructor(
        private readonly _createTrainerUseCase: CreateTrainerUseCase,
        private readonly _getAllTrainersUseCase: GetAllTrainersUseCase
    ) {}

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const trainers = await this._getAllTrainersUseCase.execute();
            res.json(trainers);
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                name,
                last_name,
                email,
                phone,
                bio,
                skills,
                availability,
                networks,
            } = req.body;
            const trainer = await this._createTrainerUseCase.execute({
                name,
                last_name,
                email,
                phone,
                bio,
                skills,
                availability,
                networks,
            });

            res.json({
                message: "Entrenador creado, pide que revise su email",
                trainer,
            });
        } catch (error) {
            next(error);
        }
    }
}
