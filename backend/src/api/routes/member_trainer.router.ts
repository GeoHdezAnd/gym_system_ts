import { Router } from "express";
import {
    authenticate,
    authorize,
    handleInputErrors,
    validateMemberId,
    validateMemberTrainerRelationCreate,
    validateWorkoutCreate,
} from "../middleware";
import { limiter } from "../../infrastructure/config/limiter";
import { MemberTrainerController } from "../controllers";
import { DIContainer } from "../../infrastructure/DIContainer";

const memberTrainerRouter = Router();

const memberTrainerController = new MemberTrainerController(
    DIContainer.getSelectTrainerUseCase(),
    DIContainer.getGetRelationMemberTrainerUseCase(),
    DIContainer.updateRelationUseCase(),
    DIContainer.getAdvisedUseCase(),
    DIContainer.getAllWorksOutUseCase(),
    DIContainer.getWorkOutUseCase(),
    DIContainer.createWorkOutUseCase(),
    DIContainer.updateWorkOutUseCase()
);

memberTrainerRouter.use(limiter, authenticate);
memberTrainerRouter.param("memberId", validateMemberId);

memberTrainerRouter.get(
    "/:memberId",
    authorize(["member", "trainer"]),
    handleInputErrors,
    memberTrainerController.getByUserId.bind(memberTrainerController)
);

memberTrainerRouter.get(
    "/advised/:trainerId",
    authorize(["trainer"]),
    memberTrainerController.getAdvisedByTrainer.bind(memberTrainerController)
);

memberTrainerRouter.post(
    "/",
    authorize(["member"]),
    validateMemberTrainerRelationCreate,
    handleInputErrors,
    memberTrainerController.create.bind(memberTrainerController)
);

memberTrainerRouter.put(
    "/:relationId",
    authorize(["member"]),
    memberTrainerController.updateRelation.bind(memberTrainerController)
);

// WORKOUTS
memberTrainerRouter.get(
    "/workout-all/:relationId",
    authorize(["trainer", "member"]),
    memberTrainerController.getAllWorksout.bind(memberTrainerController)
);

memberTrainerRouter.get(
    "/work-out/:idWorkout",
    authorize(["trainer", "trainer"]),
    memberTrainerController.getWorkOutById.bind(memberTrainerController)
);

memberTrainerRouter.post(
    "/work-out",
    authorize(["trainer"]),
    validateWorkoutCreate,
    handleInputErrors,
    memberTrainerController.createWorkOut.bind(memberTrainerController)
);

memberTrainerRouter.put(
    "/work-out/:id",
    authorize(["trainer"]),
    handleInputErrors,
    memberTrainerController.updateWorkOut.bind(memberTrainerController)
);

export default memberTrainerRouter;
