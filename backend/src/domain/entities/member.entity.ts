export interface MemberProps {
    id?: string;
    gender: string;
    born_date: Date;
    matricula: string;
    user_id: string;
}

export class Member {
    constructor(private readonly props: MemberProps) {}
    get id(): string | undefined {
        return this.props.id;
    }

    get gender(): string {
        return this.props.gender;
    }

    get born_date(): Date {
        return this.props.born_date;
    }

    get matricula(): string {
        return this.props.matricula;
    }

    get user_id(): string {
        return this.props.user_id;
    }

    updateProfile(gender: string, born_date: Date, matricula: string): void {
        if (gender) this.props.gender = gender;
        if (born_date) this.props.born_date = born_date;
        if (matricula) this.props.matricula = matricula;
    }
}
