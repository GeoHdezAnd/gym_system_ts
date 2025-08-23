import { Subscription } from "../../../domain/entities";
import {
    MemberRepository,
    PlanRepository,
    SubscriptionRepository,
} from "../../../domain/interfaces";
import { ConflictError, NotFoundError } from "../../../domain/errors";

export class CreateSuscriptionUseCase {
    constructor(
        private memberRepository: MemberRepository,
        private planRepository: PlanRepository,
        private subscriptionRepository: SubscriptionRepository
    ) {}

    async execute(member_id: string, plan_id: string): Promise<void> {
        // 1. Buscamos el miembro en la base de datos
        const member = await this.memberRepository.findByUserId(member_id);
        if (!member) {
            throw new NotFoundError("No existe el miembro");
        }

        const plan = await this.planRepository.findById(plan_id);
        if (!plan) {
            throw new NotFoundError("No existe el plan");
        }

        const suscripcionActive =
            await this.subscriptionRepository.findActiveSubscription(
                (member_id = member.profile.id!)
            );

        if (suscripcionActive) {
            throw new ConflictError(
                "Ya tiene el usuario una suscripción activa"
            );
        }
        const today = new Date();
        const startLocal = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        const suscription = new Subscription({
            member_id: member.profile.id!,
            plan_id,
            start_date: startLocal,
            end_date: this.calculateEndSuscription(
                plan.duration_days,
                startLocal
            ),
        });

        await this.subscriptionRepository.create(suscription);
    }

    private calculateEndSuscription(days: number, starLocal: Date) {
        const today = new Date();
        const endDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        endDate.setDate(starLocal.getDate() + days);
        return endDate;
    }
}
