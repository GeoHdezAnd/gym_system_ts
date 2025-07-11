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

type PlanProps = {
    id: string;
    name: string;
    description: string;
    price: number;
    duration_days: number;
    application_access: boolean;
    benefits: string[];
    is_active: boolean;
    deleted: boolean;
};
