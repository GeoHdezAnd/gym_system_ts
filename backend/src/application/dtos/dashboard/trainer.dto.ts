import { Trainer, TrainerProps, UserProps } from "../../../domain/entities";
import { TrainerModel } from "../../../infrastructure/models";

export type TrainerRequestDto = Pick<
    UserProps,
    "name" | "last_name" | "email" | "phone"
> &
    Pick<TrainerProps, "bio" | "skills" | "availability" | "networks">;

export type TrainerProfileDto = {
    id: string;
    name: string;
    last_name: string;
    email: string;
    phone: string;
    confirmed: boolean;
    profile: {
        id: string;
        skills: string[];
        networks: string[];
        availability: object;
    };
};

export class TrainerDto {
    static toDomain(input: TrainerProps): TrainerProps {
        return new Trainer({
            id: input.id,
            user_id: input.user_id,
            bio: input.bio,
            skills: input.skills,
            availability: input.availability,
            networks: input.networks,
        });
    }

    static fromSequelizeModel(input: TrainerModel): TrainerProps {
        return {
            id: input.id,
            user_id: input.user_id,
            bio: input.bio || "",
            skills: input.skills || [],
            availability: input.availability!,
            networks: input.networks || [],
        };
    }

    static fromSequelizeModelsToProfile(
        userModel: UserProps,
        trainerModel: TrainerProps
    ): TrainerProfileDto {
        return {
            id: userModel.id!,
            name: userModel.name,
            last_name: userModel.last_name,
            email: userModel.email,
            phone: userModel.phone,
            confirmed: userModel.confirmed!,
            profile: {
                id: trainerModel.id!,
                skills: trainerModel.skills,
                networks: trainerModel.networks || [],
                availability: trainerModel.availability || {},
            },
        };
    }
}
