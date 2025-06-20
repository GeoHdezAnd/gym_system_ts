import { Subscription, SubscriptionProps } from "../../domain/entities";
import { SubscriptionRepository } from "../../domain/interfaces";
import { NotFoundError } from "../../domain/errors";
import { SubscriptionModel } from "../models";
import { Op } from "@sequelize/core";

export class SequelizeSubscriptionRepository implements SubscriptionRepository {
    async create(subscription: Subscription): Promise<SubscriptionProps> {
        const subscriptionCreated = await SubscriptionModel.create({
            member_id: subscription.member_id,
            plan_id: subscription.plan_id,
            start_date: subscription.start_date,
            end_date: subscription.end_date,
        });
        return subscriptionCreated;
    }

    async findActiveSubscription(
        member_id: string,
        plan_id: string
    ): Promise<boolean> {
        const suscripcionActive = await SubscriptionModel.findOne({
            where: {
                member_id: { [Op.eq]: member_id },
                plan_id: { [Op.eq]: plan_id },
                status: { [Op.eq]: "active" },
            },
        });

        return suscripcionActive !== null;
    }

    async findLastSubscription(
        member_id: string
    ): Promise<Subscription | false> {
        const lastSubscription = await SubscriptionModel.findOne({
            where: { member_id },
            order: [["createdAt", "DESC"]], // Ordenar por fecha de creación (último primero)
        });

        if (!lastSubscription) {
            return false;
        }

        return new Subscription(lastSubscription);
    }
}
