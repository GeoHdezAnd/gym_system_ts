import { Subscription } from "../../../domain/entities";
import {
    MemberRepository,
    PlanRepository,
    SubscriptionRepository,
} from "../../../domain/interfaces";
import { ConflictError, NotFoundError } from "../../../errors";

export class CreateSuscriptionUseCase {
    constructor(
        private memberRepository: MemberRepository,
        private planRepository: PlanRepository,
        private subscriptionRepository: SubscriptionRepository
    ) {}

    async execute(memberId: string, planId: string): Promise<void> {
        // 1. Buscamos el miembro en la base de datos
        const member = await this.memberRepository.findByUserId(memberId);
        if (!member) {
            throw new NotFoundError("No existe el miembro");
        }

        const plan = await this.planRepository.findById(planId);
        if (!plan) {
            throw new NotFoundError("No existe el plan");
        }

        const suscripcionActive =
            await this.subscriptionRepository.findActiveSubscription(
                (memberId = member.profile.id!),
                planId
            );

        if (suscripcionActive) {
            throw new ConflictError(
                "Ya tiene el usuario una suscripción con ese plan activa"
            );
        }

        const suscription = new Subscription({
            memberId: member.profile.id!, // en el perfil está el id de la tabla de su perfil miembro, es donde tendra todas sus suscripciones el usuario ya que solo los miembtos pueden tener suscripcion
            planId,
            startDate: new Date(),
            endDate: this.calculateEndSuscription(plan.durationDays),
        });

        await this.subscriptionRepository.create(suscription);
    }

    private calculateEndSuscription(days: number) {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + days);
        return endDate;
    }
}
