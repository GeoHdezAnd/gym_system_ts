import { IMemberWithUserDto } from "../../application/dtos/dashboard";
import { Member } from "../entities";

export interface PaginationOptions {
    page: number;
    limit: number;
}

export interface FilterOptions {
    search?: string;
    // Aqui se pueden agregar filtros como status, fecha, etc
}

export interface MemberRepository {
    getAll(
        pagination?: PaginationOptions,
        filters?: FilterOptions
    ): Promise<{ members: IMemberWithUserDto[]; total: number }>;
    create(member: Member): Promise<Member>;
    findByUserId(user_id: string): Promise<IMemberWithUserDto | false>;
    findByMatricula(matricula: string): Promise<Member | false>;
    getProfile(user_id: string): Promise<Member | false>;
    save(member: Member): Promise<void>;
}
