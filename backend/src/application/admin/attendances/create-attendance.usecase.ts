import { Attendance } from "../../../domain/entities";
import {
    AttendanceRepository,
    MemberRepository,
    SubscriptionRepository,
} from "../../../domain/interfaces";
import { ForbiddenError, NotFoundError } from "../../../domain/errors";

export class CreateAttendanceUseCase {
    constructor(
        private readonly attendanceRepository: AttendanceRepository,
        private readonly memberRepository: MemberRepository,
        private readonly subscriptionRepository: SubscriptionRepository
    ) {}

    async execute(matricula: string): Promise<Attendance> {
        // 1. Validar miembro
        const member = await this.validateMember(matricula);

        // 2. Validar suscripción activa
        await this.validateActiveSubscription(member.id!);

        // 3. Manejar lógica de asistencia
        return this.handleAttendanceLogic(member.id!);
    }

    private async validateMember(matricula: string) {
        const member = await this.memberRepository.findByMatricula(matricula);
        if (!member) {
            throw new NotFoundError("Miembro no encontrado");
        }
        return member;
    }

    private async validateActiveSubscription(memberId: string) {
        const subscription =
            await this.subscriptionRepository.findLastSubscription(memberId);

        if (!subscription || subscription.status !== "active") {
            throw new ForbiddenError(
                "El miembro no tiene una suscripción activa para acceder al gimnasio"
            );
        }
    }

    private async handleAttendanceLogic(
        member_id: string
    ): Promise<Attendance> {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalizar fecha para comparación

        // Buscar asistencia del día actual
        const existingAttendance =
            await this.attendanceRepository.findTodayAttendance(
                member_id,
                today
            );

        if (!existingAttendance) {
            // Crear nueva asistencia
            const newAttendance = new Attendance({ member_id });
            const createdAttendance = await this.attendanceRepository.create(
                newAttendance
            );
            return new Attendance(createdAttendance!);
        }

        if (!existingAttendance.exit) {
            // Registrar salida
            existingAttendance.exit = new Date();
            await this.attendanceRepository.updateAttendance(
                existingAttendance
            );
            return new Attendance(existingAttendance);
        }

        throw new ForbiddenError(
            "Ya tienes registrada entrada y salida para el día de hoy"
        );
    }
}
