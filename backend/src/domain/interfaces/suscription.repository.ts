import { Subscription, SubscriptionProps } from "../entities";

export interface SubscriptionRepository {
    create(subscription: Subscription): Promise<SubscriptionProps>;
    findActiveSubscription(member_id: string, plan_id: string): Promise<boolean>;
    findLastSubscription(memberId: string): Promise<Subscription | false>;
}
