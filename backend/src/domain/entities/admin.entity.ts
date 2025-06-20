export interface AdminProps {
    id?: string;
    userId: string;
    accessLevel: string;
}

export class Admin {
    constructor(private readonly props: AdminProps) {}

    get id(): string | undefined {
        return this.props.id;
    }
    get userId(): string {
        return this.props.userId;
    }
    get accessLevel(): string {
        return this.props.accessLevel;
    }

    hasFullAccess(): boolean {
        return this.props.accessLevel === "full";
    }
}
