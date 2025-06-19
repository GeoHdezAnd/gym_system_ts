import { Member, MemberProps } from "../entities";

export interface MemberWithUser {
    id: string;
    name: string;
    lastName: string;
    email: string;
    phone: string;
    confirmed: boolean;

    profile: Omit<MemberProps, "userId">;
}

export interface MemberRepository {
    getAll(): Promise<MemberWithUser[]>;
    create(member: Member): Promise<Member>;
    findByUserId(userId: string): Promise<MemberWithUser | false>;
    findByMatricula(matricula: string): Promise<Member | false>;
    getProfile(userId: string): Promise<Member | false>;
    save(member: Member): Promise<void>;
}
