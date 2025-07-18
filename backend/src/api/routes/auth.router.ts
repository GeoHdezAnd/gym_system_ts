import { Router } from "express";
import { DIContainer } from "../../infrastructure/DIContainer";
import { AuthController } from "../controllers";
import { limiter } from "../../infrastructure/config/limiter";
import {
    authenticate,
    authorize,
    handleInputErrors,
    validateUserDashInput,
    validateMemberAuthInput,
    validatePasswordReset,
    validateUpdatePassword,
    validateUserAuthInput,
} from "../middleware";
import { body, param } from "express-validator";

const authRouter = Router();
const authController = new AuthController(
    DIContainer.getSignUpAdminUseCase(),
    DIContainer.getSignUpMemberUseCase(),
    DIContainer.getSignInUseCase(),
    DIContainer.getConfirmAccountUseCase(),
    DIContainer.getForgotPasswordUseCase(),
    DIContainer.getValidateTokenUseCase(),
    DIContainer.getResetPasswordWTokenUseCase(),
    DIContainer.getUpdateCurrentPasswordUseCase(),
    DIContainer.getCheckPasswordUseCase()
);

authRouter.use(limiter);

// REGISTRO DE ADMINISTRADORES SERA RUTA PROTEGIDA SOLO PARA ADMINISTRADORES
authRouter.post(
    "/admin/sign-up",
    authenticate,
    authorize(["admin"]),
    validateUserDashInput,
    handleInputErrors,
    authController.signUpAdmin.bind(authController)
);

// REGISTRO DE MIEMBROS DEL GIMNASIO
authRouter.post(
    "/sign-up",
    validateUserAuthInput,
    validateMemberAuthInput,
    handleInputErrors,
    authController.signUpMember.bind(authController)
);

// Login
authRouter.post(
    "/sign-in",
    body("email").isEmail().withMessage("Email no valido"),
    body("password").notEmpty().withMessage("El password no puede ir vacio"),
    handleInputErrors,
    authController.signIn.bind(authController)
);

// Obtener datos de usuario logeado
authRouter.get(
    "/user",
    authenticate,
    authController.getUser.bind(authController)
);

// Obtener los datos del miembro logueado
authRouter.get("/profile", authenticate, authorize(["member"]));

authRouter.post(
    "/confirm-account",
    body("token").isLength({ min: 6, max: 6 }).withMessage("Token no valido"),
    handleInputErrors,
    authController.confirmAccount.bind(authController)
);

authRouter.post(
    "/forgot-password",
    body("email").isEmail().withMessage("Email no valido"),
    handleInputErrors,
    authController.forgotPassword.bind(authController)
);

authRouter.post(
    "/validate-token/:token",
    param("token").isLength({ min: 5, max: 6 }).withMessage("Token no valido"),
    handleInputErrors,
    authController.validateToken.bind(authController)
);

authRouter.post(
    "/reset-password/:token",
    validatePasswordReset,
    handleInputErrors,
    authController.resetPasswordWToken.bind(authController)
);

authRouter.post(
    "/update-password",
    authenticate,
    validateUpdatePassword,
    handleInputErrors,
    authController.updateCurrentPassword.bind(authController)
);

authRouter.post(
    "/check-password",
    authenticate,
    body("password")
        .notEmpty()
        .withMessage("El password actual no puede ir vacio"),
    handleInputErrors,
    authController.checkPassword.bind(authController)
);

export default authRouter;
