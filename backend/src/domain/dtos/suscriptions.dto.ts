/*
Los DTO'S sirven para formatear la información que se comparte entre los casos de uso y los repositorios. 
Esta caracteristica nos permite dividir la logica y no exponer información de nuestros modelos con la logica lo cual permite hacer uso de conceptos SOLID para mejorar nuestra aplicación 
 */

import { SubscriptionModel } from "../../infrastructure/models";
import { Subscription } from "../entities";

export type SubscriptionDetailsResponseDto = {
    id?: string;
    start_date: Date;
    end_date: Date;
    status: string;
    plan?: {
        id: string;
        name: string;
        application_access: boolean;
        price: number;
        duration_days: number;
    };
};

export class SubscriptionDto {
    static toDomain(raw: Subscription): Subscription {
        return new Subscription({
            id: raw.id,
            member_id: raw.member_id,
            plan_id: raw.plan_id,
            start_date: raw.start_date,
            end_date: raw.end_date,
        });
    }

    static toShowInfo(data: SubscriptionModel): SubscriptionDetailsResponseDto {
        const subscription = new Subscription({
            id: data.id,
            member_id: data.member_id,
            plan_id: data.plan_id,
            start_date: data.start_date,
            end_date: data.end_date,
        });
        return {
            id: data.id,
            start_date: data.start_date!,
            end_date: data.end_date!,
            status: subscription.status,
            plan: {
                id: data.plan?.id ?? "",
                name: data.plan?.name ?? "",
                price: data.plan?.price ?? 0,
                application_access: data.plan?.application_access ?? false,
                duration_days: data.plan?.duration_days ?? 0,
            },
        };
    }
}
