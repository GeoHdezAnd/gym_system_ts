export interface SubscriptionProps {
    id?: string;
    member_id: string;
    plan_id: string;
    start_date: Date;
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

    get start_date(): Date {
        return this.props.start_date;
    }

    get end_date(): Date {
        return this.props.end_date;
    }

    get status(): string | undefined {
        return this.props.status;
    }

    checkStatus(): { status: string; daysRemaining?: number } {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalizamos la fecha para comparación

        const endDate = new Date(this.props.end_date);
        endDate.setHours(0, 0, 0, 0);

        if (today > endDate && this.props.status !== "expired") {
            this.props.status = "expired";
            return {
                status: this.props.status,
                daysRemaining: 0,
            };
        }

        if (this.props.status === "active") {
            const timeDiff = endDate.getTime() - today.getTime();
            const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

            return {
                status: this.props.status,
                daysRemaining,
            };
        }

        return {
            status: this.props.status!,
        };
    }
}
