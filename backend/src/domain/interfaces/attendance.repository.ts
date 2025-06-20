import { Attendance } from "../entities";

export type AttendancesWithMember = {
    name: string,
    matricula: string,
    entry: Date | null,
    exit: Date  | null,
}

export interface AttendanceRepository {
    getAllAttendancesWithMember(): Promise<AttendancesWithMember[]>
    create(attendance: Attendance): Promise<Attendance | null>;
    findWithMemberId(member_id: string): Promise<Attendance | null>;
    updateAttendance(attendance: Attendance): Promise<Attendance>;
    findTodayAttendance(
        member_id: string,
        date: Date
    ): Promise<Attendance | null>;
}
