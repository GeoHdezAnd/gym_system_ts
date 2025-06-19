export type MemberProps = {
    id: string;
    name: string;
    lastName: string;
    email: string;
    phone: string;
    confirmed: boolean;
    profile: {
        gender: string;
        bornDate: Date;
        matricula: string;
    };
};
