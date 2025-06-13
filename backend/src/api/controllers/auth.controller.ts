import type { NextFunction, Request, Response } from "express";
import {
    SignUpAdminUseCase,
    ConfirmAccountUseCase,
    ForgotPasswordUseCase,
    ValidateTokenUseCase,
    ResetPasswordWTokenUseCase,
} from "../../core/use-case/auth";

import { SignInUseCase } from "../../core/use-case/auth/sign-in.usecase";
import { UpdateCurrentPasswordUseCase } from "../../core/use-case/auth/update-current-password.usecase";
import { CheckPasswordUseCase } from "../../core/use-case/auth/check-password.usecase";
import { SignUpMemberUseCase } from "../../core/use-case/auth/sign-up-member.usecase";
export class AuthController {
    constructor(
        private signUpAdminUseCase: SignUpAdminUseCase,
        private signUpMemberUseCase: SignUpMemberUseCase,
        private signInUseCase: SignInUseCase,

        private confirmAccountUseCase: ConfirmAccountUseCase,
        private forgotPasswordUseCase: ForgotPasswordUseCase,
        private validateTokenUseCase: ValidateTokenUseCase,
        private resetPassworWTokenUseCase: ResetPasswordWTokenUseCase,
        private updateCurrentPasswordUseCase: UpdateCurrentPasswordUseCase,
        private checkPasswordUseCase: CheckPasswordUseCase
    ) {}

    async signUpAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, last_name, email, password, phone, access_level } =
                req.body;

            await this.signUpAdminUseCase.execute({
                name,
                lastName: last_name,
                email,
                phone,
                password,
                accessLevel: access_level || "limited",
            });

            res.status(201).json("Cuenta creada correctamente :)");
        } catch (error) {
            next(error);
        }
    }

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
            await this.signUpMemberUseCase.execute({
                name,
                lastName: last_name,
                email,
                phone,
                password,
                gender,
                bornDate: born_date,
            });
            res.status(201).json("Cuenta creada correctamente :)");
        } catch (error) {
            next(error);
        }
    }

    async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const response = await this.signInUseCase.execute(email, password);
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

            await this.confirmAccountUseCase.execute({ token });
            res.json("Cuenta Confirmada correctamente :)");
        } catch (error) {
            next(error);
        }
    }

    async forgotPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;

            await this.forgotPasswordUseCase.execute({ email });
            res.json("Revisa tu email para seguir las instrucciones");
        } catch (error) {
            next(error);
        }
    }

    async validateToken(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.params;
            await this.validateTokenUseCase.execute(token);
            res.json("Token válido, asigna un nuevo password");
        } catch (error) {
            next(error);
        }
    }

    async resetPasswordWToken(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.params;
            const { password } = req.body;

            await this.resetPassworWTokenUseCase.execute({ token, password });
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
            await this.updateCurrentPasswordUseCase.execute({
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
            await this.checkPasswordUseCase.execute(password, id);
            res.json("Password correcto");
        } catch (error) {
            next(error);
        }
    }
}
