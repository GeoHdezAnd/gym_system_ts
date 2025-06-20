import { Attendance } from "../../domain/entities";
import {
    AttendanceRepository,
    AttendancesWithMember,
} from "../../domain/interfaces";
import { AttendanceModel, MemberModel } from "../models";
import { Op } from "@sequelize/core";

export class SequelizeAttendanceRepository implements AttendanceRepository {
    async getAllAttendancesWithMember(): Promise<AttendancesWithMember[]> {
        const members = await MemberModel.findAll({
            include: [
                {
                    association: "user_account",
                    required: true,
                    where: {
                        deleted: false,
                    },
                    include: [
                        {
                            association: "role",
                            where: { name: "member" },
                            attributes: [],
                        },
                    ],
                    attributes: ["name", "last_name"],
                },
                {
                    association: "attendances",
                    attributes: ["entry", "exit"],
                    required: true,
                },
            ],
        });

        return members.flatMap((member) => {
            // Si no hay asistencias, retornamos array vacío
            if (!member.attendances || member.attendances.length === 0)
                return [];

            // Mapeamos cada asistencia a un objeto de resultado
            return member.attendances.map((attendance) => ({
                name: `${member.user_account?.name} ${member.user_account?.last_name}`,
                matricula: member.matricula,
                entry: attendance.entry,
                exit: attendance.exit,
            }));
        });
    }
    async create(attendance: Attendance): Promise<Attendance> {
        const attendanceCreated = await AttendanceModel.create({
            member_id: attendance.member_id,
        });

        return new Attendance(attendanceCreated);
    }

    async findWithMemberId(member_id: string): Promise<Attendance | null> {
        const attendance = await AttendanceModel.findOne({
            where: { member_id },
        });
        if (!attendance) {
            return null;
        }
        return new Attendance(attendance);
    }

    async updateAttendance(attendance: Attendance): Promise<Attendance> {
        const attendanceExists = await AttendanceModel.findByPk(attendance.id);

        await attendanceExists?.update({
            exit: attendance.exit,
        });

        return new Attendance(attendanceExists!);
    }
    async findTodayAttendance(
        member_id: string,
        date: Date
    ): Promise<Attendance | null> {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const attendance = await AttendanceModel.findOne({
            where: {
                member_id,
                entry: {
                    [Op.between]: [startOfDay, endOfDay],
                },
            },
        });
        if (!attendance) {
            return null;
        }
        return new Attendance(attendance);
    }
}
