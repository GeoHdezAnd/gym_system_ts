export interface RoleProps {
    id: number;
    name: string;
}

export class Role {
    constructor(private readonly props: RoleProps) {}

    get id(): number {
        return this.props.id;
    }

    get name(): string {
        return this.props.name;
    }

    
}
