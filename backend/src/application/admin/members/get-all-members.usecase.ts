import { MemberRepository } from "../../../domain/interfaces";
import { IMemberWithUserDto } from "../../auth/dtos/response";

export class GetAllMembersUseCase {
    constructor(private memberRepository: MemberRepository) {}

    async execute(
        page: number = 1,
        limit: number = 10,
        search?: string
    ): Promise<{
        members: IMemberWithUserDto[];
        total: number;
        pages: number;
        currentPage: number;
    }> {
        const { members, total } = await this.memberRepository.getAll(
            { page, limit },
            { search }
        );

        const pages = Math.ceil(total / limit);

        return { members, total, pages, currentPage: page };
    }
}
