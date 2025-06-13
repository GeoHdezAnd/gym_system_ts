import { Router } from "express";
import { limiter } from "../../infrastructure/config/limiter";
import {
    authenticate,
    authorize,
    handleInputErrors,
    validatePlanExists,
    validatePlanId,
    validatePlanInput,
} from "../middleware";
import { PlanController } from "../controllers";
import { DIContainer } from "../../infrastructure/DIContainer";

const planRouter = Router();
const planController = new PlanController(
    DIContainer.getPlansUseCase(),
    DIContainer.getCreatePlanUseCase(),
    DIContainer.getUpdatePlanUseCase(),
    DIContainer.getDeletePlanUseCase(),
);

planRouter.use(limiter, authenticate, authorize(["admin"]));
planRouter.param("planId", validatePlanId);
planRouter.param("planId", validatePlanExists);

// Ruta creación de plan
planRouter.post(
    "/",
    validatePlanInput,
    handleInputErrors,
    planController.create.bind(planController)
);

// Ruta para obtener todos de la base de datos
planRouter.get("/", planController.getAll.bind(planController));

// Ruta para obtener plan por ID
planRouter.get("/:planId", planController.getById.bind(planController));

// Ruta para actualiazr plan por ID
planRouter.put(
    "/:planId",
    validatePlanInput,
    handleInputErrors,
    planController.update.bind(planController)
);

// Ruta para eliminar por ID
planRouter.delete(
    "/:planId",
    handleInputErrors,
    planController.delete.bind(planController)
);

export default planRouter;
