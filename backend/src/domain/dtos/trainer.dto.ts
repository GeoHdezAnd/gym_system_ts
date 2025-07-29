import { Trainer, TrainerProps, UserProps } from "../entities";
import { TrainerModel } from "../../infrastructure/models";

export type TrainerRequestDto = Pick<
    UserProps,
    "name" | "last_name" | "email" | "phone"
> &
    Pick<TrainerProps, "bio" | "skills">;


export type ITrainerProfileDto = {
    id: string;
    name: string;
    last_name: string;
    email: string;
    phone: string;
    confirmed: boolean;
    profile: {
        id: string;
        bio: string;
        skills: string[];
    };
};

export class TrainerDto {
    static toDomain(input: TrainerProps): TrainerProps {
        return new Trainer({
            id: input.id,
            user_id: input.user_id,
            bio: input.bio,
            skills: input.skills,
        });
    }

    static fromSequelizeModel(input: TrainerModel): TrainerProps {
        return {
            id: input.id,
            user_id: input.user_id,
            bio: input.bio || "",
            skills: input.skills || [],
        };
    }

    static fromSequelizeModelsToProfile(
        userModel: UserProps,
        trainerModel: TrainerProps
    ): ITrainerProfileDto {
        return {
            id: userModel.id!,
            name: userModel.name,
            last_name: userModel.last_name,
            email: userModel.email,
            phone: userModel.phone,
            confirmed: userModel.confirmed!,
            profile: {
                id: trainerModel.id!,
                bio: trainerModel.bio!,
                skills: trainerModel.skills,
            },
        };
    }
}
