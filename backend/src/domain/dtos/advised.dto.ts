export type ResponseAdvisedDto = {
    member: {
        id: string;
        name: string;
        last_name: string;
        phone: string;
        gender: string;
    };
    relation: {
        id: string;
        goal: string;
    };
};

export class AdvisedDto {
    static toResponseAdvisedAll(raw: any): ResponseAdvisedDto {
        return {
            member: {
                id: raw.member.user_account.id,
                name: raw.member.user_account.name,
                last_name: raw.member.user_account.last_name,
                phone: raw.member.user_account.phone,
                gender: raw.member.gender,
            },
            relation: {
                id: raw.id,
                goal: raw.goal || "",
            },
        };
    }
}
