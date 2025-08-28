import { Router } from "express";
import { AdminController } from "../controllers";
import { limiter } from "../../infrastructure/config/limiter";
import {
    authenticate,
    authorize,
    validateAdminExists,
    validateAdminId,
} from "../middleware";
import { DIContainer } from "../../infrastructure/DIContainer";

const adminRouter = Router();
const adminController = new AdminController(
    DIContainer.getAllAdminsUseCase(),
    DIContainer.getDeleteUserUseCase(),
    DIContainer.updateAdminUseCase()
);

adminRouter.use(limiter, authenticate);
adminRouter.param("adminId", validateAdminId);
adminRouter.param("adminId", validateAdminExists);

adminRouter.get(
    "/",
    authorize(["admin"]),
    adminController.getAll.bind(adminController)
);

adminRouter.get(
    "/:adminId",
    authorize(["admin"]),
    adminController.getAdminById.bind(adminController)
);

adminRouter.delete(
    "/:adminId",
    authorize(["admin"]),
    adminController.deleteAdminById.bind(adminController)
);

adminRouter.put(
    "/:adminId",
    authorize(["admin"]),
    adminController.updateAdmin.bind(adminController)
);

export default adminRouter;
