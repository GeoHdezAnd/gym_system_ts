export interface MemberProps {
    id?: string;
    gender: string;
    bornDate: Date;
    matricula: string;
    userId: string;
}

export class Member {
    constructor(private readonly props: MemberProps) {}
    get id(): string | undefined {
        return this.props.id;
    }

    get gender(): string {
        return this.props.gender;
    }

    get bornDate(): Date {
        return this.props.bornDate;
    }

    get matricula(): string {
        return this.props.matricula;
    }

    get userId(): string {
        return this.props.userId;
    }

    updateProfile(gender: string, bornDate: Date, matricula: string): void {
        if (gender) this.props.gender = gender;
        if (bornDate) this.props.bornDate = bornDate;
        if (matricula) this.props.matricula = matricula;
    }
}
