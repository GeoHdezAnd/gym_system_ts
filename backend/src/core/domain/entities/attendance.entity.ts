export interface AttendanceProps {
    id?: string;
    memberId: string;
    entry?: Date;
    exit?: Date;
}

export class Attendance {
    constructor(private readonly props: AttendanceProps) {}

    get id(): string | undefined {
        return this.props.id;
    }

    get memberId(): string {
        return this.props.memberId;
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
