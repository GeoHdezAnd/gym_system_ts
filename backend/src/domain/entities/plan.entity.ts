export interface PlanProps {
    id?: string;
    name: string;
    description: string;
    benefits: string[];
    price: number;
    duration_days: number;
    is_active?: boolean;
    deleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Plan {
    constructor(private readonly props: PlanProps) {}

    get id(): string | undefined {
        return this.props.id;
    }
    get name(): string {
        return this.props.name;
    }

    get description(): string {
        return this.props.description;
    }

    get benefits(): string[] {
        return this.props.benefits;
    }

    get price(): number {
        return this.props.price;
    }

    get duration_days(): number {
        return this.props.duration_days;
    }
    get is_active(): boolean | undefined {
        return this.props.is_active;
    }

    get deleted(): boolean | undefined {
        return this.props.deleted;
    }

    get createdAt(): Date | undefined {
        return this.props.createdAt;
    }
    get updatedAt(): Date | undefined {
        return this.props.updatedAt;
    }

    update({
        name,
        description,
        benefits,
        price,
        duration_days,
    }: Partial<PlanProps>): void {
        if (name) this.props.name = name;
        if (description) this.props.description = description;
        if (benefits) this.props.benefits = benefits;
        if (price) this.props.price = price;
        if (duration_days) this.props.duration_days = duration_days;
    }

    softDelete(): void {
        this.props.is_active = false;
        this.props.deleted = true;
    }

    restore(): void {
        this.props.is_active = true;
        this.props.deleted = false;
    }
}
