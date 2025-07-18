export interface TrainerProps {
    id?: string;
    user_id: string;
    bio?: string;
    skills: string[];
    availability: object;
    networks?: string[];
}

export class Trainer {
    constructor(private readonly props: TrainerProps) {}
    get id(): string | undefined {
        return this.props.id;
    }
    get user_id(): string  {
        return this.user_id;
    }

    get bio(): string | undefined {
        return this.bio;
    }

    get skills(): string[] {
        return this.skills || [];
    }

    get availability(): object {
        return this.availability;
    }

    get networks(): string[] {
        return this.networks || [];
    }
}
