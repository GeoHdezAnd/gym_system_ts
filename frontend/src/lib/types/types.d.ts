export type MemberProps = {
    user: {
        id: string;
        name: string;
        last_name: string;
        email: string;
        phone: string;
        confirmed: boolean;
    };

    profile: {
        gender: string;
        born_date: Date;
        matricula: string;
    };
};
