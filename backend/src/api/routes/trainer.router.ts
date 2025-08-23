import { Router } from "express";
import { TrainerController } from "../controllers";
import { DIContainer } from "../../infrastructure/DIContainer";
import { limiter } from "../../infrastructure/config/limiter";
import {
    authenticate,
    authorize,
    handleInputErrors,
    validateUserDashInput,
    validateTrainerId,
    validateTrainerExists,
} from "../middleware";

const trainerRouter = Router();

const trainerController = new TrainerController(
    DIContainer.createTrainerUseCase(),
    DIContainer.getAllTrainersUseCase(),
    DIContainer.getDeleteUserUseCase(),
    DIContainer.getUpdateTrainerUseCase()
);

trainerRouter.use(limiter, authenticate);
trainerRouter.param("trainerID", validateTrainerId);
trainerRouter.param("trainerID", validateTrainerExists);

trainerRouter.get(
    "/",
    authorize(["admin", "member"]),
    trainerController.getAll.bind(trainerController)
);

trainerRouter.get(
    "/:trainerID",
    trainerController.getById.bind(trainerController)
);

trainerRouter.post(
    "/",
    authorize(["admin"]),
    validateUserDashInput,
    handleInputErrors,
    trainerController.create.bind(trainerController)
);

trainerRouter.put(
    "/:trainerID",
    validateUserDashInput,
    handleInputErrors,
    trainerController.update.bind(trainerController)
);

trainerRouter.delete(
    "/:trainerID",
    handleInputErrors,
    trainerController.deleteTrainerById.bind(trainerController)
);

export default trainerRouter;
