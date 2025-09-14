import { Workout, WorkoutProps } from "../../domain/entities";
import { NotFoundError } from "../../domain/errors";
import { WorkoutRepository } from "../../domain/interfaces";
import { WorkoutModel } from "../models";

export class SequelizeWorkoutRepository implements WorkoutRepository {
    async getAllByRelationId(
        relation_id: string
    ): Promise<WorkoutProps[] | []> {
        const workouts = await WorkoutModel.findAll({
            where: { relation_id },
            attributes: [
                "id",
                "relation_id",
                "start_date",
                "end_date",
                "name",
                "exercises",
            ],
            order: [["updatedAt", "DESC"]],
        });

        if (!workouts.length) return [];
        return workouts.map((workout) => new Workout(workout).toPersistance());
    }

    async getById(id: string): Promise<WorkoutProps> {
        const workOutModel = await WorkoutModel.findByPk(id);
        if (!workOutModel) {
            throw new NotFoundError("No existe la rutina");
        }
        return new Workout(workOutModel!).toPersistance();
    }

    async createWorkOut(workout: WorkoutProps): Promise<WorkoutProps | void> {
        const workOutModel = await WorkoutModel.create({
            name: workout.name,
            relation_id: workout.relation_id!,
            start_date: workout.start_date,
            end_date: workout.end_date,
            exercises: workout.exercises,
        });
        const workoutResponse = new Workout(workOutModel);
        return workoutResponse.toPersistance();
    }

    async updateWorkOut({
        id,
        workout,
    }: {
        id: string;
        workout: WorkoutProps;
    }): Promise<WorkoutProps> {
        const workOutModel = await WorkoutModel.findByPk(id);

        if (!workOutModel) throw new NotFoundError("No existe la rutina");
        const workoutUpdated = await workOutModel.update({
            name: workout.name,
            start_date: workout.start_date,
            end_date: workout.end_date,
            exercises: workout.exercises,
        });

        return new Workout(workoutUpdated).toPersistance();
    }
    async deleteWorkOutById(id: string): Promise<void> {
        await WorkoutModel.destroy({
            where: {
                id,
            },
        });
    }
}
