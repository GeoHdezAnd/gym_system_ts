import { Subscription, SubscriptionProps } from "../entities";

export interface SubscriptionRepository {
    create(subscription: Subscription): Promise<SubscriptionProps>;
    findActiveSubscription(memberId: string, planId: string): Promise<boolean>;
    findLastSubscription(memberId: string): Promise<Subscription | false>;
}
