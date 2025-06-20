import {
    MemberRepository,
    MemberWithUser,
} from "../../../domain/interfaces";

export class GetAllMembersUseCase {
    constructor(private memberRepository: MemberRepository) {}

    async execute(): Promise<MemberWithUser[]> {
        const members = await this.memberRepository.getAll();
        return members;
    }
}
