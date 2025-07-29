export interface TrainerProps {
    id?: string;
    user_id: string;
    bio?: string;
    skills: string[];
}

export class Trainer {
    constructor(private readonly props: TrainerProps) {}
    get id(): string | undefined {
        return this.props.id;
    }
    get user_id(): string {
        return this.props.user_id;
    }

    get bio(): string | undefined {
        return this.props.bio;
    }

    get skills(): string[] {
        return this.props.skills || [];
    }

    updateProfile(bio?: string, skills?: string[]): void {
        if (bio) this.props.bio = bio;
        if (skills) this.props.skills = skills;
    }
}
