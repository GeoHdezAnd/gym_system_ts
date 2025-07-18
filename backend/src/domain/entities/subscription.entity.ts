export interface SubscriptionProps {
    id?: string;
    member_id: string;
    plan_id: string;
    start_date?: Date;
    end_date: Date;
    status?: string;
}

export class Subscription {
    constructor(private readonly props: SubscriptionProps) {}

    get id(): string | undefined {
        return this.props.id;
    }

    get member_id(): string {
        return this.props.member_id;
    }

    get plan_id(): string {
        return this.props.plan_id;
    }

    get start_date(): Date | undefined {
        return this.props.start_date;
    }

    get end_date(): Date {
        return this.props.end_date;
    }

    get status(): string | undefined {
        return this.props.status;
    }

    public isActive(): boolean {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endDate = new Date(this.props.end_date);
        return this.props.status === "active" && today <= endDate;
    }

    public markAsExpired(): void {
        if (this.props.status != "expired") {
            this.props.status = "expired";
        }
    }
}
