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
import { body, query } from "express-validator";

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
// Esta ruta contiene paginador por lo que recive parametros query
memberRouter.get(
    "/",
    [
        query("page").optional().isInt({ min: 1 }).toInt(),
        query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
        query("search").optional().trim().escape(),
    ],
    memberController.getAll.bind(memberController)
);

// Ruta para obtener miembro por ID
memberRouter.get("/:memberId", memberController.getById.bind(memberController));

// Ruta para actualizar miembro desde panel admin por id
memberRouter.put(
    "/:memberId",
    validateMemberInput,
    handleInputErrors,
    memberController.updateMemberById.bind(memberController)
);
// Ruta para eliminar por lote
memberRouter.delete(
    "/batch-delete/",
    body("userIds").isArray({ min: 1 }),
    body("userIds.*").isString(),
    handleInputErrors,
    memberController.deleteMemberBatch.bind(memberController)
);
// Ruta para eliminar miembros
memberRouter.delete(
    "/:memberId",
    handleInputErrors,
    memberController.deleteMemberById.bind(memberController)
);

export default memberRouter;
