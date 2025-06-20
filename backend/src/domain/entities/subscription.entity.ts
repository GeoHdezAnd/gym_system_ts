export interface SubscriptionProps {
    id?: string;
    memberId: string;
    planId: string;
    startDate: Date;
    endDate: Date;
    status?: string;
}

export class Subscription {
    constructor(private readonly props: SubscriptionProps) {}

    get id(): string | undefined {
        return this.props.id;
    }

    get memberId(): string {
        return this.props.memberId;
    }

    get planId(): string {
        return this.props.planId;
    }

    get startDate(): Date {
        return this.props.startDate;
    }

    get endDate(): Date {
        return this.props.endDate;
    }

    get status(): string | undefined {
        return this.props.status;
    }

    checkStatus(): { status: string; daysRemaining?: number } {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalizamos la fecha para comparación

        const endDate = new Date(this.props.endDate);
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
