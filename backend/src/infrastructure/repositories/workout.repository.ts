import { Workout, WorkoutProps } from "../../domain/entities";
import { WorkoutRepository } from "../../domain/interfaces";
import { WorkoutModel } from "../models";

export class SequelizeWorkoutRepository implements WorkoutRepository {
    async getAllByRelationId(
        relation_id: string
    ): Promise<WorkoutProps[] | []> {
        const workouts = await WorkoutModel.findAll({
            where: { relation_id },
            attributes: ["id", "relation_id", "name", "exercises"],
        });

        if (!workouts.length) return [];
        return workouts.map((workout) => new Workout(workout));
    }
}
