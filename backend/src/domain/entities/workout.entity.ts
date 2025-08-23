export type TExercises = {
    name: string;
    sets: number;
    reps_goal: number;
    notes: string;
};

export interface WorkoutProps {
    id?: string;
    relation_id: string;
    name: string;
    start_date: Date;
    end_date: Date;
    exercises: TExercises[];
}

export class Workout {
    private _id?: string;
    private _relation_id: string;
    private _name: string;
    private _start_date: Date;
    private _end_date: Date;
    private _exercises: TExercises[];

    constructor(private readonly props: WorkoutProps) {
        this._id = props.id;
        this._relation_id = props.relation_id;
        this._name = props.name;
        this._start_date = props.start_date;
        this._end_date = new Date(props.end_date);
        this._exercises = props.exercises || [
            {
                name: "",
                sets: 0,
                reps_goal: 0,
                notes: "",
            },
        ];
    }

    get id(): string | undefined {
        return this._id;
    }

    get relation_id(): string {
        return this._relation_id;
    }

    get name(): string {
        return this._name;
    }

    get start_date(): Date {
        return this._start_date;
    }

    get end_date(): Date {
        return this._end_date;
    }

    get exercises(): TExercises[] {
        return this._exercises;
    }

    toPersistance(): WorkoutProps {
        return {
            id: this._id,
            relation_id: this.relation_id,
            name: this._name,
            start_date: this._start_date,
            end_date: this._end_date,
            exercises: this._exercises,
        };
    }
}
