import { Member, MemberProps } from "../entities";

export interface MemberWithUser {
    id: string;
    name: string;
    last_name: string;
    email: string;
    phone: string;
    confirmed: boolean;

    profile: Omit<MemberProps, "user_id">;
}

export interface MemberRepository {
    getAll(): Promise<MemberWithUser[]>;
    create(member: Member): Promise<Member>;
    findByUserId(user_id: string): Promise<MemberWithUser | false>;
    findByMatricula(matricula: string): Promise<Member | false>;
    getProfile(user_id: string): Promise<Member | false>;
    save(member: Member): Promise<void>;
}
