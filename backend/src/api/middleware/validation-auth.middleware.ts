import type { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";

export const handleInputErrors = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};

// VALIDACIÓNES DE REGISTROS DE USUARIOS
export const validateUserAuthInput = async (
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
    await body("password")
        .isLength({ min: 6 })
        .withMessage("La contraseña debe ser mayor a 6 caracteres")
        .matches(/[A-Z]/)
        .withMessage("Debe contener al menos una letra mayuscula")
        .matches(/[a-z]/)
        .withMessage("Debe contener al menos una letra minuscula")
        .matches(/\d/)
        .withMessage("Debe contener al menos un número")
        .matches(/[\W_]/)
        .withMessage("Debe contener al menos un caratcer especial")
        .run(req);
    await body("password_confirm")
        .custom((value, { req }) => {
            return value !== req.body.password;
        })
        .withMessage("Las contraseñas no coinciden")
        .run(req);
    next();
};

export const validateMemberAuthInput = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    await body("gender")
        .notEmpty()
        .withMessage("El genero es obligatorio")
        .isLength({ min: 1, max: 1 })
        .withMessage("El genero debe contener 1 letra")
        .isIn(["F", "M"])
        .withMessage("El genero debe ser F o M")
        .run(req);
    await body("born_date")
        .isString()
        .withMessage("Fecha no valida")
        .run(req);
    next();
};

export const validatePasswordReset = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    await param("token")
        .notEmpty()
        .isLength({ min: 6, max: 6 })
        .withMessage("Token no válido")
        .run(req);
    await body("password")
        .isLength({ min: 6 })
        .withMessage("El password es muy corto, mínimo 6 caracteres")
        .matches(/[A-Z]/)
        .withMessage("Debe contener al menos una letra mayuscula")
        .matches(/[a-z]/)
        .withMessage("Debe contener al menos una letra minuscula")
        .matches(/\d/)
        .withMessage("Debe contener al menos un número")
        .matches(/[\W_]/)
        .withMessage("Debe contener al menos un caratcer especial")
        .run(req);
    next();
};

export const validateUpdatePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    await body("current_password")
        .notEmpty()
        .withMessage("El password actual no puede ir vacio")
        .run(req);
    await body("password")
        .isLength({ min: 6 })
        .withMessage("El password es muy corto, mínimo 6 caracteres")
        .matches(/[A-Z]/)
        .withMessage("Debe contener al menos una letra mayuscula")
        .matches(/[a-z]/)
        .withMessage("Debe contener al menos una letra minuscula")
        .matches(/\d/)
        .withMessage("Debe contener al menos un número")
        .matches(/[\W_]/)
        .withMessage("Debe contener al menos un caratcer especial")
        .run(req);
    next();
};


