import { Router } from "express";
import {
    authenticate,
    authorize,
    handleInputErrors,
    validateMemberExists,
    validateMemberId,
    validateMemberInput,
} from "../middleware";
import { MemberController } from "../controllers";
import { limiter } from "../../infrastructure/config/limiter";
import { DIContainer } from "../../infrastructure/DIContainer";

const memberRouter = Router();
const memberController = new MemberController(
    DIContainer.getCreateMemberUseCase(),
    DIContainer.getMembersUseCase(),
    DIContainer.getUpdateMemberUseCase(),
    DIContainer.getDeleteUserUseCase()
);

memberRouter.use(limiter, authenticate, authorize(["admin"]));
memberRouter.param("memberId", validateMemberId);
memberRouter.param("memberId", validateMemberExists);

/**  Rutas protegidas para operaciones del administrador */
memberRouter.post(
    "/",
    validateMemberInput,
    handleInputErrors,
    memberController.createMember.bind(memberController)
);

// Ruta para obtener todos los miembros
memberRouter.get("/", memberController.getAll.bind(memberController));

// Ruta para obtener miembro por ID
memberRouter.get("/:memberId", memberController.getById.bind(memberController));

// Ruta para actualizar miembro desde panel admin por id
memberRouter.put(
    "/:memberId",
    validateMemberInput,
    handleInputErrors,
    memberController.updateMemberById.bind(memberController)
);

// Ruta para eliminar miembros
memberRouter.delete('/:memberId', handleInputErrors, memberController.deleteMemberById.bind(memberController))

export default memberRouter;
