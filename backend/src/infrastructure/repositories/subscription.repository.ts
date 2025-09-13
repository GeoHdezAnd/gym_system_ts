import { Subscription, SubscriptionProps } from "../../domain/entities";
import { SubscriptionRepository } from "../../domain/interfaces";
import { PlansModel, SubscriptionModel } from "../models";
import {
    SubscriptionDetailsResponseDto,
    SubscriptionDto,
} from "../../domain/dtos/suscriptions.dto";

export class SequelizeSubscriptionRepository implements SubscriptionRepository {
    async create(subscription: Subscription): Promise<SubscriptionProps> {
        const subscriptionCreated = await SubscriptionModel.create({
            member_id: subscription.member_id,
            plan_id: subscription.plan_id,
            start_date: subscription.start_date!,
            end_date: subscription.end_date,
        });
        return subscriptionCreated;
    }

    async findAllSubscriptionUser(
        member_id: string
    ): Promise<SubscriptionDetailsResponseDto[] | []> {
        const subscriptions = await SubscriptionModel.findAll({
            where: { member_id },
            include: [
                {
                    model: PlansModel,
                    as: "plan",
                    attributes: [
                        "id",
                        "name",
                        "application_access",
                        "price",
                        "duration_days",
                    ],
                },
            ],
            order: [["end_date", "DESC"]],
        });

        // Si no hay suscripciones, retornamos []
        if (!subscriptions.length) return [];

        return subscriptions.map((model) => SubscriptionDto.toShowInfo(model));
    }

    async findActiveSubscription(member_id: string): Promise<boolean> {
        const model = await SubscriptionModel.findOne({
            where: { member_id },
            order: [["createdAt", "DESC"]], // Ordenar por fecha de creación (último primero)
        });

        if (!model) return false;

        const suscription = new Subscription(model);

        const suscripcionActive = suscription.status;

        return suscripcionActive === "active" ? true : false;
    }

    async findLastSubscription(
        member_id: string
    ): Promise<Subscription | false> {
        const model = await SubscriptionModel.findOne({
            where: { member_id },
            order: [["createdAt", "DESC"]], // Ordenar por fecha de creación (último primero)
        });

        if (!model) {
            return false;
        }
        // Convertir a entidad de dominio
        const subscription = new Subscription({
            id: model.id,
            member_id: model.member_id,
            plan_id: model.plan_id,
            start_date: model.start_date,
            end_date: model.end_date,
        });

        return subscription;
    }

    async findById(id: string): Promise<Subscription | false> {
        const model = await SubscriptionModel.findByPk(id);
        if (!model) return false;
        return new Subscription({
            id: model.id,
            member_id: model.member_id,
            plan_id: model.plan_id,
            start_date: model.start_date,
            end_date: model.end_date,
        });
    }

    async deleteById(id: string): Promise<void> {
        await SubscriptionModel.destroy({
            where: {
                id: id,
            },
        });
    }
}
