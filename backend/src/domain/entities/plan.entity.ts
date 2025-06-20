export interface PlanProps {
    id?: string;
    name: string;
    description: string;
    benefits: string[];
    price: number;
    durationDays: number;
    isActive?: boolean;
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

    get durationDays(): number {
        return this.props.durationDays;
    }
    get isActive(): boolean | undefined {
        return this.props.isActive;
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
        durationDays,
    }: Partial<PlanProps>): void {
        if (name) this.props.name = name;
        if (description) this.props.description = description;
        if (benefits) this.props.benefits = benefits;
        if (price) this.props.price = price;
        if (durationDays) this.props.durationDays = durationDays;
    }

    softDelete(): void {
        this.props.isActive = false;
        this.props.deleted = true;
    }

    restore(): void {
        this.props.isActive = true;
        this.props.deleted = false;
    }
}
