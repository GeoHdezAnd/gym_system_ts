import type { Request, Response, NextFunction } from "express";
import { body, param } from "express-validator";
import { SequelizeMemberTrainerRepository, SequelizeWorkoutRepository } from "../../infrastructure/repositories";
import { MemberTrainerProps, WorkoutProps } from "../../domain/entities";

declare global {
    namespace Express {
        interface Request {
            relation?: MemberTrainerProps;
            workOut?: WorkoutProps
        }
    }
}

export const validateMemberTrainerRelationCreate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    await body("memberId")
        .isString()
        .withMessage("El ID debe ser una cadena de texto")
        .bail()
        .matches(
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
        )
        .withMessage("ID no válido, debe ser un UUID válido")
        .run(req);
    await body("trainerId")
        .isString()
        .withMessage("El ID debe ser una cadena de texto")
        .bail()
        .matches(
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
        )
        .withMessage("ID no válido, debe ser un UUID válido")
        .run(req);
    next();
};

export const validateRelationId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    await param("relationId")
        .isString()
        .withMessage("El ID debe ser una cadena de texto")
        .bail()
        .matches(
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
        )
        .withMessage("ID no válido, debe ser un UUID válido")
        .run(req);
    next();
};

export const validateRelationExistsById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const relationRepository = new SequelizeMemberTrainerRepository();
    try {
        const { relationId } = req.params;
        const relation = await relationRepository.getById(relationId);
        req.relation = relation;
        next();
    } catch (error) {
        next(error);
    }
};


export const validateWorkOutID = async (
req: Request,
    res: Response,
    next: NextFunction
) => {
    await param("workOutId")
        .isString()
        .withMessage("El ID debe ser una cadena de texto")
        .bail()
        .matches(
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
        )
        .withMessage("ID no válido, debe ser un UUID válido")
        .run(req);
    next(); 
}

export const validateWorkExists = async (
req: Request,
    res: Response,
    next: NextFunction
) => {
    const workoutRepository = new SequelizeWorkoutRepository();
    try {
        const { workOutId } = req.params;
        const workOut = await workoutRepository.getById(workOutId);
        req.workOut = workOut;
        next();
    }
    catch (error) {
        next(error)
    }
}

export const validateWorkoutCreate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Validar campo name
    await body("name")
        .isString()
        .withMessage("El nombre de la rutina es obligatorio")
        .bail()
        .isLength({ min: 1, max: 50 })
        .withMessage("El nombre no puede tener más de 50 caracteres")
        .run(req);

    // Validar campo start_date
    await body("start_date")
        .isString()
        .withMessage("La fecha de inicio es obligatoria")
        .bail()
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage("Formato de fecha inválido. Use YYYY-MM-DD")
        .run(req);

    // Validar campo end_date
    await body("end_date")
        .isString()
        .withMessage("La fecha de fin es obligatoria")
        .bail()
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage("Formato de fecha inválido. Use YYYY-MM-DD")
        .run(req);

    // Validar que end_date sea posterior a start_date
    await body()
        .custom((value, { req }) => {
            const { start_date, end_date } = req.body;
            if (start_date && end_date) {
                return new Date(end_date) >= new Date(start_date);
            }
            return true;
        })
        .withMessage("La fecha de fin debe ser posterior a la fecha de inicio")
        .run(req);

    // Validar campo exercises (array)
    await body("exercises")
        .isArray({ min: 1, max: 12 })
        .withMessage("Debe agregar entre 1 y 12 ejercicios")
        .run(req);

    // Validar cada ejercicio en el array
    await body("exercises.*.name")
        .isString()
        .withMessage("El nombre del ejercicio es obligatorio")
        .bail()
        .isLength({ min: 1, max: 50 })
        .withMessage("El nombre no puede tener más de 50 caracteres")
        .run(req);

    await body("exercises.*.sets")
        .custom((value) => {
            // Convertir a número si es string
            const numValue =
                typeof value === "string" ? parseInt(value) : value;
            return (
                Number.isInteger(numValue) && numValue >= 1 && numValue <= 20
            );
        })
        .withMessage("Debe haber entre 1 y 20 sets")
        .run(req);

    await body("exercises.*.reps_goal")
        .custom((value) => {
            // Convertir a número si es string
            const numValue =
                typeof value === "string" ? parseInt(value) : value;
            return (
                Number.isInteger(numValue) && numValue >= 1 && numValue <= 15
            );
        })
        .withMessage("Debe haber entre 1 y 15 repeticiones")
        .run(req);

    await body("exercises.*.notes")
        .optional()
        .isString()
        .withMessage("Las notas deben ser texto")
        .bail()
        .isLength({ max: 100 })
        .withMessage("Las notas no pueden tener más de 100 caracteres")
        .run(req);

    next();
};
