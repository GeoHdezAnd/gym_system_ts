import { Router } from "express";
import { limiter } from "../../infrastructure/config/limiter";
import {
    authenticate,
    authorize,
    handleInputErrors,
    validatePlanId,
    validateSuscriptionData,
    validateSuscriptionExists,
    validateSuscriptionId,
    validateUserId,
} from "../middleware";
import { SuscriptionController } from "../controllers/suscription.controller";
import { DIContainer } from "../../infrastructure/DIContainer";

const suscriptionRouter = Router();
const suscriptionController = new SuscriptionController(
    DIContainer.getCreateSuscriptionUseCase(),
    DIContainer.getAllSuscriptionsUserUseCase(),
    DIContainer.deleteSuscriptionUseCase()
);

suscriptionRouter.use(limiter, authenticate);
suscriptionRouter.param("subscriptionId", validateSuscriptionId);
suscriptionRouter.param("subscriptionId", validateSuscriptionExists);

suscriptionRouter.post(
    "/",
    authorize(["admin"]),
    validateSuscriptionData,
    handleInputErrors,
    suscriptionController.create.bind(suscriptionController)
);

suscriptionRouter.get(
    "/:userId",
    authorize(["admin", "member"]),
    validateUserId,
    handleInputErrors,
    suscriptionController.getAllByUserId.bind(suscriptionController)
);

suscriptionRouter.delete(
    "/:subscriptionId",
    authorize(["admin"]),
    handleInputErrors,
    suscriptionController.deleteById.bind(suscriptionController)
)

export default suscriptionRouter;
