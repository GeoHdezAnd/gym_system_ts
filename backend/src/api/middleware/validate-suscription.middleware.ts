import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

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
