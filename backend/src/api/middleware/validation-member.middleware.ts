import type { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import { SequelizeMemberRepository } from "../../infrastructure/repositories";
import { NotFoundError } from "../../domain/errors";
import { IMemberWithUserDto } from "../../application/auth/dtos/response";

declare global {
    namespace Express {
        interface Request {
            member?: IMemberWithUserDto;
        }
    }
}

export const validateMemberId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    await param("memberId")
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
export const validateMemberExists = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const memberRepository = new SequelizeMemberRepository();
    try {
        const { memberId } = req.params;
        const member = await memberRepository.findByUserId(memberId);
        if (!member) {
            throw new NotFoundError("Miembro no encontrado");
        }
        req.member = member;
        next();
    } catch (error) {
        next(error);
    }
};

export const validateMemberInput = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    await body("name")
        .notEmpty()
        .withMessage("El nombre es obligatorio")
        .run(req);
    await body("last_name")
        .notEmpty()
        .withMessage("El apellido es obligatorio")
        .run(req);
    await body("email")
        .isEmail()
        .withMessage("El email no contiene formato correcto")
        .run(req);
    await body("phone")
        .isMobilePhone("es-MX")
        .withMessage("El telefono no es valido")
        .run(req);
    await body("gender")
        .notEmpty()
        .withMessage("El genero es obligatorio")
        .isLength({ min: 1, max: 1 })
        .withMessage("El genero debe contener 1 letra")
        .isIn(["F", "M"])
        .withMessage("El genero debe ser F o M")
        .run(req);
    await body("born_date").isString().withMessage("Fecha no valida").run(req);
    next();
};
