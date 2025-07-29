export type BaseUserProps = {
    id: string;
    name: string;
    last_name: string;
    email: string;
    phone: string;
    confirmed: boolean;
};
export type MemberProps = BaseUserProps & {
    profile: {
        id: string;
        gender: string;
        born_date: Date;
        matricula: string;
        status?: string;
    };
};

export type TrainerProps = BaseUserProps & {
    profile: {
        id: string;
        skills: string[];
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
    start_date: Date;
    end_date: Date;
    status: string;
};

export type SubsciptionMemberInfo = Subscription & {
    plan: Pick<
        PlanProps,
        "id" | "name" | "price" | "application_access" | "duration_days"
    >;
};
