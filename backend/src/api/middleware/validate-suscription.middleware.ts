import { NextFunction, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import { SequelizeSubscriptionRepository } from "../../infrastructure/repositories";
import { NotFoundError } from "../../domain/errors";
import { SubscriptionProps } from "../../domain/entities";

declare global {
    namespace Express {
        interface Request {
            subscription?: SubscriptionProps;
        }
    }
}

export const validateSuscriptionData = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    await body("userId")
        .isString()
        .withMessage("El ID debe ser una cadena de texto")
        .bail()
        .matches(
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
        )
        .withMessage("ID no válido, debe ser un UUID válido")
        .run(req);
    await body("planId")
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

export const validateUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    await param("userId")
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

export const validateSuscriptionId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    await param("subscriptionId")
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

export const validateSuscriptionExists = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const subscriptionRepository = new SequelizeSubscriptionRepository();
    try {
        const { subscriptionId } = req.params;
        const subscription = await subscriptionRepository.findById(
            subscriptionId
        );
        if (!subscription) throw new NotFoundError("La suscripción no existe");
        req.subscription = subscription;
        next();
    } catch (error) {
        next(error);
    }
};
