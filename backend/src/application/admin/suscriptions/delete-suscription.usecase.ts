import { Subscription, SubscriptionProps } from "../../../domain/entities";
import { ConflictError } from "../../../domain/errors";
import { SubscriptionRepository } from "../../../domain/interfaces";

export class DeleteSubsciptionUseCase {
    constructor(private subscriptionRepository: SubscriptionRepository) {}

    async execute(subscription: SubscriptionProps): Promise<void> {
        const today = new Date().toISOString().split("T")[0];
        if(subscription.start_date.toString() !== today){
            throw new ConflictError("No se puede eliminar una subscripción que no sea de hoy")
        }
        
        await this.subscriptionRepository.deleteById(subscription.id!);
    }
}
