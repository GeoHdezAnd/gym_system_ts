export interface AdminProps {
    id?: string;
    user_id?: string;
    access_level: string;
}

export class Admin {
    constructor(private readonly props: AdminProps) {}

    get id(): string | undefined {
        return this.props.id;
    }
    get user_id(): string | undefined {
        return this.props.user_id;
    }
    get access_level(): string {
        return this.props.access_level;
    }

    hasFullAccess(): boolean {
        return this.props.access_level === "full";
    }
}
