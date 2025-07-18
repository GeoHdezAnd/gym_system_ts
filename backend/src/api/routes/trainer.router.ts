import { Router } from "express";
import { TrainerController } from "../controllers";
import { DIContainer } from "../../infrastructure/DIContainer";
import { limiter } from "../../infrastructure/config/limiter";
import {
    authenticate,
    authorize,
    handleInputErrors,
    validateUserDashInput,
} from "../middleware";

const trainerRouter = Router();

const trainerController = new TrainerController(
    DIContainer.createTrainerUseCase(),
    DIContainer.getAllTrainersUseCase()
);

trainerRouter.use(limiter, authenticate);

trainerRouter.get(
    "/",
    authorize(["admin"]),
    trainerController.getAll.bind(trainerController)
);

trainerRouter.post(
    "/",
    authorize(["admin"]),
    validateUserDashInput,
    handleInputErrors,
    trainerController.create.bind(trainerController)
);

export default trainerRouter;
