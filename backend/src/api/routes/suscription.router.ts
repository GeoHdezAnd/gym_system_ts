import { Router } from "express";
import { limiter } from "../../infrastructure/config/limiter";
import {
    authenticate,
    authorize,
    handleInputErrors,
    validatePlanId,
    validateSuscriptionData,
    validateUserId,
} from "../middleware";
import { SuscriptionController } from "../controllers/suscription.controller";
import { DIContainer } from "../../infrastructure/DIContainer";

const suscriptionRouter = Router();
const suscriptionController = new SuscriptionController(
    DIContainer.getCreateSuscriptionUseCase(),
    DIContainer.getAllSuscriptionsUserUseCase()
);

suscriptionRouter.use(limiter, authenticate, authorize(["admin"]));
suscriptionRouter.param("suscriptionId", validatePlanId);

suscriptionRouter.post(
    "/",
    validateSuscriptionData,
    handleInputErrors,
    suscriptionController.create.bind(suscriptionController)
);

suscriptionRouter.get(
    "/:userId",
    validateUserId,
    handleInputErrors,
    suscriptionController.getAllByUserId.bind(suscriptionController)
);

export default suscriptionRouter;
