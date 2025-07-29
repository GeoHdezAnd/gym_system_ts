export type SubscriptionStatus = "active" | "expired" | "pending" | "inactive";

export interface SubscriptionProps {
    id?: string;
    member_id: string;
    plan_id: string;
    start_date?: Date;
    end_date: Date;
}

export class Subscription {
    private _start_date: Date;
    private _end_date: Date;

    constructor(private readonly props: SubscriptionProps) {
        this._start_date = props.start_date || new Date();
        this._end_date = new Date(props.end_date);

        // Validaciones básicas
        if (this._start_date > this._end_date) {
            throw new Error(
                "La fecha de inicio no puede ser posterior a la fecha de fin"
            );
        }
    }

    get id(): string | undefined {
        return this.props.id;
    }

    get member_id(): string {
        return this.props.member_id;
    }

    get plan_id(): string {
        return this.props.plan_id;
    }

    get start_date(): Date {
        return this._start_date;
    }

    get end_date(): Date {
        return this._end_date;
    }

    // Propiedad calculada para el estado
    get status(): SubscriptionStatus {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalizamos la fecha

        if (today < this._start_date) {
            return "pending";
        } else if (today > this._end_date) {
            return "expired";
        } else {
            return "active";
        }
    }


    

    
}
