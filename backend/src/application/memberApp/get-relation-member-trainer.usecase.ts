import { MemberTrainer, MemberTrainerProps } from "../../domain/entities";
import { NotFoundError } from "../../domain/errors";
import {
    MemberRepository,
    MemberTrainerRepository,
} from "../../domain/interfaces";

export class GetRelationMemberTrainerUseCase {
    constructor(
        private readonly _memberRepository: MemberRepository,
        private readonly _memberTrainerRepository: MemberTrainerRepository
    ) {}

    async execute(memberId: string): Promise<MemberTrainerProps | null> {
        // 1. Buscamos el usuario en la tabla de miembros
        const member = await this._memberRepository.getProfile(memberId);

        if (!member || !member.id)
            throw new NotFoundError("No existe el miembro");

        // 2. Obtener la relación
        const relation = await this._memberTrainerRepository.getByMemberId(
            member.id
        );
        return  relation ? relation.toPersistance() : null;
    }
}
