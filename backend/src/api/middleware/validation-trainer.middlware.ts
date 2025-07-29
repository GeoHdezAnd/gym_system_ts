import type { Request, Response, NextFunction } from "express";

import { ITrainerProfileDto } from "../../domain/dtos/trainer.dto";
import { param, validationResult } from "express-validator";
import { SequelizeTrainerRepository } from "../../infrastructure/repositories";
import { NotFoundError } from "../../domain/errors";

declare global {
    namespace Express {
        interface Request {
            trainer?: ITrainerProfileDto;
        }
    }
}

export const validateTrainerId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    await param("trainerID")
        .isString()
        .withMessage("El ID debe ser una cadena de texto")
        .bail()
        .matches(
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
        )
        .withMessage("ID no válido, debe ser un UUID válido")
        .run(req);
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const validateTrainerExists = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const trainerRepository = new SequelizeTrainerRepository();
    try {
        const { trainerID } = req.params;
        const trainer = await trainerRepository.findByUserId(trainerID);
        if (!trainer) {
            throw new NotFoundError("Entrenador no encontrado");
        }
        req.trainer = trainer;
        next();
    } catch (error) {
        next(error);
    }
};
