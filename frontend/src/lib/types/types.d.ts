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

type Subscription = {
    id: string;
    start_date:   Date;
    end_date: Date;
    status: string;
};

export type SubsciptionMemberInfo = Subscription & {
    plan: Pick<
        PlanProps,
        "id" | "name" | "price" | "application_access" | "duration_days"
    >;
};
