export type TProgress = {
    weight: number;
};

export type TrainerProf = {
    id: string;
    name: string;
    last_name: string;
    phone: string;
};

export type MemberProf = {
    id: string;
    name: string;
    last_name: string;
    phone: string;
    gender: string;
};

export interface MemberTrainerProps {
    id?: string;
    member_id: string;
    trainer_id: string;
    notes?: string;
    goal?: string;
    progress?: TProgress;
    trainer_profile?: TrainerProf;
    member_profile?: MemberProf;
}

export class MemberTrainer {
    private _id?: string;
    private _member_id: string;
    private _trainer_id: string;
    private _notes: string;
    private _goal: string;
    private _progress: TProgress;
    private _trainer: TrainerProf;
    private _member: MemberProf;

    constructor(private readonly props: MemberTrainerProps) {
        this._id = props.id;
        this._member_id = props.member_id;
        this._trainer_id = props.trainer_id;
        this._notes = props.notes || "";
        this._goal = props.goal || "";
        this._progress = props.progress || {
            weight: 0,
        };

        this._trainer = props.trainer_profile || {
            id: "",
            name: "",
            last_name: "",
            phone: "",
        };

        this._member = props.member_profile || {
            id: "",
            name: "",
            last_name: "",
            phone: "",
            gender: "",
        };
    }

    get id(): string | undefined {
        return this._id;
    }

    get member_id(): string {
        return this._member_id;
    }
    get trainer_id(): string {
        return this._trainer_id;
    }
    get notes(): string {
        return this._notes;
    }

    get goal(): string {
        return this._goal;
    }
    get progress(): TProgress {
        return this._progress;
    }

    get trainer_profile(): TrainerProf {
        return this._trainer;
    }
    get member_profile(): MemberProf {
        return this._member;
    }
    toPersistance(): MemberTrainerProps {
        return {
            id: this._id,
            member_id: this._member_id,
            trainer_id: this._trainer_id,
            notes: this._notes,
            goal: this._goal, // Copia del array
            progress: { ...this._progress }, // Copia del objeto
            trainer_profile: {
                ...this._trainer,
            },
            member_profile: {
                ...this._member,
            },
        };
    }
}
