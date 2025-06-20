import type { NextFunction, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import { SequelizePlanRepository } from "../../infrastructure/repositories";
import { NotFoundError } from "../../domain/errors";
import { PlanProps } from "../../domain/entities";

declare global {
    namespace Express {
        interface Request {
            plan?: PlanProps;
        }
    }
}

export const validatePlanId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    await param("planId")
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

export const validatePlanExists = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const planRepository = new SequelizePlanRepository();
    try {
        const { planId } = req.params;
        const plan = await planRepository.findById(planId);
        if (!plan) {
            throw new NotFoundError("Plan no encontrado");
        }

        req.plan = plan;
        next();
    } catch (error) {
        next(error);
    }
};

export const validatePlanInput = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    await body("name")
        .notEmpty()
        .withMessage("El nombre del plan no puede ir vacio")
        .run(req);
    await body("description")
        .notEmpty()
        .withMessage("La descripción del plan no puede ir vacio")
        .run(req);
    await body("benefits")
        .isArray({ min: 1, max: 5 })
        .withMessage("Debes ingresar más de 1 beneficio y menos de 5")
        .run(req);
    await body("benefits.*")
        .optional()
        .isString()
        .withMessage("Cada beneficio debe ser una cadena de texto")
        .run(req);
    await body("price")
        .isNumeric()
        .withMessage("Precio no valido")
        .custom((value) => value >= 0)
        .withMessage("El precio no puede ser 0 o menor")
        .run(req);
    await body("duration_days")
        .isNumeric()
        .withMessage("Duración no valida")
        .custom((value) => value >= 0)
        .withMessage("El valor de la duración no puede ser 0 o menor")
        .run(req);
    next();
};
