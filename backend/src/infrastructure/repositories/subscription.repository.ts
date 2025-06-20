import { Subscription, SubscriptionProps } from "../../domain/entities";
import { SubscriptionRepository } from "../../domain/interfaces";
import { NotFoundError } from "../../domain/errors";
import { SubscriptionModel } from "../models";
import { Op } from "@sequelize/core";

export class SequelizeSubscriptionRepository implements SubscriptionRepository {
    async create(subscription: Subscription): Promise<SubscriptionProps> {
        const subscriptionCreated = await SubscriptionModel.create({
            memberId: subscription.memberId,
            planId: subscription.planId,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
        });
        return subscriptionCreated;
    }

    async findActiveSubscription(
        memberId: string,
        planId: string
    ): Promise<boolean> {
        const suscripcionActive = await SubscriptionModel.findOne({
            where: {
                memberId: { [Op.eq]: memberId },
                planId: { [Op.eq]: planId },
                status: { [Op.eq]: "active" },
            },
        });

        return suscripcionActive !== null;
    }

    async findLastSubscription(
        memberId: string
    ): Promise<Subscription | false> {
        const lastSubscription = await SubscriptionModel.findOne({
            where: { memberId },
            order: [["createdAt", "DESC"]], // Ordenar por fecha de creación (último primero)
        });

        if (!lastSubscription) {
            return false;
        }

        return new Subscription(lastSubscription);
    }
}
