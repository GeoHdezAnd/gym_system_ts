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
        gender: "M" | "F" | "O";
        born_date: string;
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

/// Type de Relación cliente entrenador
export type TProgress = {
    weight: number | undefined;
};
export type TRelationMemberTrainer = {
    id?: string;
    trainer_id: string;
    goal: string;
    notes: string;
    progress: TProgress;
    trainer_profile?: {
        id: string;
        name: string;
        last_name: string;
        phone: string;
    };
};

export type TAdvisedResponse = {
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

export type TExercises = {
    name: string;
    sets: number;
    reps_goal: number;
    notes: string;
};

export type TWorkOutResponse = {
    id: string;
    relation_id: string;
    name: string;
    exercises: TExercises[];
};
