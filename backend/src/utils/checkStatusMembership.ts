import { Subscription } from "../domain/entities";

export function checkAndUpdateSubscriptionStatus(
    subscription: Subscription
): Subscription {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(subscription.end_date);
    endDate.setHours(0, 0, 0, 0);

    if (today >= endDate && subscription.status !== "expired") {
        subscription.markAsExpired();
    }

    return subscription;
}
