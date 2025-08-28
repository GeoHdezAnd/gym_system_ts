import type { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import { SequelizeAdminRepository } from "../../infrastructure/repositories";
import { NotFoundError } from "../../domain/errors";
import { IAdminWithUserDto } from "../../domain/dtos/admin.dto";

declare global {
    namespace Express {
        interface Request {
            admin?: IAdminWithUserDto;
        }
    }
}

export const validateAdminId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    await param("adminId")
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

export const validateAdminExists = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const adminRepository = new SequelizeAdminRepository();
    try {
        const { adminId } = req.params;
        const admin = await adminRepository.findByUserId(adminId);
        if (!admin) {
            throw new NotFoundError("Admin no encontrado");
        }
        req.admin = admin!;
        next();
    } catch (error) {
        next(error);
    }
};
