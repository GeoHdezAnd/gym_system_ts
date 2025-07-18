import { NotFoundError } from "../../../domain/errors";
import {
    MemberRepository,
    SubscriptionRepository,
} from "../../../domain/interfaces";
import {
    SubscriptionDetailsResponseDto,
    SubscriptionDto,
} from "../../dtos/dashboard";

export class GetSuscriptionsUserUseCase {
    constructor(
        private _memberRepository: MemberRepository,
        private _suscriptionRepository: SubscriptionRepository
    ) {}

    async execute(
        userId: string
    ): Promise<SubscriptionDetailsResponseDto[] | []> {
        // Buscamos miembro en la base de datos
        const member = await this._memberRepository.findByUserId(userId);
        if (!member) {
            throw new NotFoundError("No existe el miembro");
        }

        const suscriptions =
            await this._suscriptionRepository.findAllSubscriptionUser(
                member.profile.id
            );

        return suscriptions.map(SubscriptionDto.toShowInfo) || [];
    }
}
