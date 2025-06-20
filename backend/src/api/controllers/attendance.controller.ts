import type { NextFunction, Request, Response } from "express";
import {
    CreateAttendanceUseCase,
    GetAllAttendancesWithMember,
} from "../../application/admin/attendances";

export class AttendanceController {
    constructor(
        private createAttendanceUseCas: CreateAttendanceUseCase,
        private getAttendencesWithMember: GetAllAttendancesWithMember
    ) {}
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const membersAttendances =
                await this.getAttendencesWithMember.execute();
            res.json(membersAttendances);
        } catch (error) {
            next(error);
        }
    }
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const attendance = await this.createAttendanceUseCas.execute(
                req.body.matricula
            );

            if (!attendance?.exit) {
                res.json({ message: "Asistencia creada", attendance });
                return;
            }
            res.json({
                message: "Salida registrada",
                attendance,
            });
        } catch (error) {
            next(error);
        }
    }
}
