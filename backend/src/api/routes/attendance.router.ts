import { Router } from "express";
import { limiter } from "../../infrastructure/config/limiter";
import { AttendanceController } from "../controllers";
import { DIContainer } from "../../infrastructure/DIContainer";

const attendecandeRouter = Router();
const attendanceController = new AttendanceController(
    DIContainer.getCreateAttendance(),
    DIContainer.getAllAttendances()
);

attendecandeRouter.use(limiter);

attendecandeRouter.get(
    "/",
    attendanceController.getAll.bind(attendanceController)
);

attendecandeRouter.post(
    "/",
    attendanceController.create.bind(attendanceController)
);

export default attendecandeRouter;
