export interface AttendanceProps {
    id?: string;
    member_id: string;
    entry?: Date;
    exit?: Date;
}

export class Attendance {
    constructor(private readonly props: AttendanceProps) {}

    get id(): string | undefined {
        return this.props.id;
    }

    get member_id(): string {
        return this.props.member_id;
    }

    get entry(): Date | undefined {
        return this.props.entry;
    }

    get exit(): Date | undefined {
        return this.props.exit;
    }

    set exit(value: Date) {
        this.props.exit = value;
    }
}
