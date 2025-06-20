import {
    AttendanceRepository,
    AttendancesWithMember,
} from "../../../domain/interfaces";

export class GetAllAttendancesWithMember {
    constructor(private attendanceRepository: AttendanceRepository) {}

    async execute(): Promise<AttendancesWithMember[]> {
        const attendances =
            await this.attendanceRepository.getAllAttendancesWithMember();

        return attendances;
    }
}
