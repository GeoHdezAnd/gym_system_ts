import { SubscriptionDetailsResponseDto } from "../../domain/dtos/suscriptions.dto";
import { Subscription, SubscriptionProps } from "../entities";

export interface SubscriptionRepository {
    create(subscription: Subscription): Promise<SubscriptionProps>;
    findAllSubscriptionUser(
        member_id: string
    ): Promise<SubscriptionDetailsResponseDto[] | []>;
    findActiveSubscription(member_id: string): Promise<boolean>;
    findLastSubscription(member_id: string): Promise<Subscription | false>;
}
