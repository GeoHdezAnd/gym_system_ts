import type { NextFunction, Request, Response } from "express";
import {
    SignUpAdminUseCase,
    ConfirmAccountUseCase,
    ForgotPasswordUseCase,
    ValidateTokenUseCase,
    ResetPasswordWTokenUseCase,
} from "../../application/auth";

import { SignInUseCase } from "../../application/auth/sign-in.usecase";
import { UpdateCurrentPasswordUseCase } from "../../application/auth/update-current-password.usecase";
import { CheckPasswordUseCase } from "../../application/auth/check-password.usecase";
import { SignUpMemberUseCase } from "../../application/auth/sign-up-member.usecase";

/**
 * Controlador para operaciones de autenticación y gestión de usuarios.
 * Incluye registro, login, confirmación de cuenta, recuperación y cambio de contraseña.
 */
export class AuthController {
    constructor(
        private readonly _signUpAdminUseCase: SignUpAdminUseCase,
        private readonly _signUpMemberUseCase: SignUpMemberUseCase,
        private readonly _signInUseCase: SignInUseCase,

        private readonly _confirmAccountUseCase: ConfirmAccountUseCase,
        private readonly _forgotPasswordUseCase: ForgotPasswordUseCase,
        private readonly _validateTokenUseCase: ValidateTokenUseCase,
        private readonly _resetPassworWTokenUseCase: ResetPasswordWTokenUseCase,
        private readonly _updateCurrentPasswordUseCase: UpdateCurrentPasswordUseCase,
        private readonly _checkPasswordUseCase: CheckPasswordUseCase
    ) {}

    /** Registro de administradores / solo es posible con un administrador autenticado */
    async signUpAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, last_name, email, phone, access_level } = req.body;

            const result = await this._signUpAdminUseCase.execute({
                name,
                last_name,
                email,
                phone,
                access_level: access_level || "limited",
            });

            res.status(201).json({
                message: "Admin creado correctamente, pida que revise su email",
                result,
            });
        } catch (error) {
            next(error);
        }
    }

    /** Registro de miembros */
    async signUpMember(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                name,
                last_name,
                email,
                password,
                phone,
                gender,
                born_date,
            } = req.body;
            const result = await this._signUpMemberUseCase.execute({
                name,
                last_name: last_name,
                email,
                phone,
                password,
                gender,
                born_date: born_date,
            });
            res.status(201).json({
                message: "Cuenta creada correctamente, revisa tu email",
                result,
            });
        } catch (error) {
            next(error);
        }
    }

    /** Login al sistema */
    async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const response = await this._signInUseCase.execute(email, password);
            res.json(response);
        } catch (error) {
            next(error);
        }
    }

    async getUser(req: Request, res: Response) {
        if (req) res.json(req.user);
    }

    async confirmAccount(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.body;

            await this._confirmAccountUseCase.execute({ token });
            res.json("Cuenta Confirmada correctamente :)");
        } catch (error) {
            next(error);
        }
    }

    async forgotPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;

            await this._forgotPasswordUseCase.execute(email);
            res.json("Revisa tu email para seguir las instrucciones");
        } catch (error) {
            next(error);
        }
    }

    async validateToken(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.params;
            await this._validateTokenUseCase.execute(token);
            res.json("Token válido, asigna un nuevo password");
        } catch (error) {
            next(error);
        }
    }

    async resetPasswordWToken(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.params;
            const { password } = req.body;

            await this._resetPassworWTokenUseCase.execute({ token, password });
            res.json("Password modificado correctamente");
        } catch (error) {
            next(error);
        }
    }
    async updateCurrentPassword(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const { current_password, password } = req.body;
        const { id } = req.user;

        try {
            await this._updateCurrentPasswordUseCase.execute({
                currentPassword: current_password,
                password,
                id,
            });
            res.json("Password modificado correctamente");
        } catch (error) {
            next(error);
        }
    }

    async checkPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { password } = req.body;
            const { id } = req.user;
            await this._checkPasswordUseCase.execute(password, id);
            res.json("Password correcto");
        } catch (error) {
            next(error);
        }
    }
}
