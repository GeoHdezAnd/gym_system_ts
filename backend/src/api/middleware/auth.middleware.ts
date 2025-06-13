import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../../infrastructure/models";
import { UnauthorizedError, ForbiddenError } from "../../core/errors";
import { User } from "../../core/domain/entities";

declare global {
    namespace Express {
        interface Request {
            user: UserModel;
        }
    }
}

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const bearer = req.headers.authorization;

    if (!bearer) {
        const error = new Error("No autorizado");
        res.status(401).json({ error: error.message });
        return;
    }

    const [_, token] = bearer.split(" ");
    if (!token) {
        const error = new Error("Token no válido");
        res.status(401).json({ error: error.message });
        return;
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET no está definida como variable de entorno");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === "object" && "id" in decoded) {
            const user = await UserModel.findByPk(decoded.id, {
                attributes: ["id", "name", "lastName", "email", "phone"],
                include: [
                    {
                        association: UserModel.associations.role,
                        attributes: ["name"],
                    },
                    {
                        association: UserModel.associations.memberProfile,
                        attributes: ["matricula", "gender"],
                        required: false,
                    },
                    {
                        association: UserModel.associations.admin,
                        attributes: [],
                        required: false,
                    },
                ],
            });

            if (!user) {
                const error = new Error("Usuario logueado no encontrado");
                res.status(404).json({ error: error.message });
                return;
            }

            

            req.user = user;
            next();
        }
    } catch (error) {
        // console.log(error);
        res.status(500).json({ error: "Token no válido" });
    }
};

// Autorización por roles
type Role = "admin" | "member";

export const authorize = (allowedRoles: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Primero verifica que el usuario esté autenticado
        if (!req.user) {
            throw new UnauthorizedError("Usuario no autorizado");
        }

        try {
            // Obtener el rol del usuario
            const userRole = req.user.role?.name;

            if (!userRole) {
                throw new ForbiddenError("No tienes permisos");
            }

            // Verificar si el rol del usuario está en los roles permitidos
            if (allowedRoles.includes(userRole as Role)) {
                next();
            } else {
                throw new ForbiddenError("No tienes permiso para acceder");
            }
        } catch (error) {
            next(error);
        }
    };
};
