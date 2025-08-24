import { WorkoutProps } from "../entities";

export interface WorkoutRepository {
    getAllByRelationId(relation_id: string): Promise<WorkoutProps[] | []>;
    getById(id: string): Promise<WorkoutProps>;
    createWorkOut(workout: WorkoutProps): Promise<WorkoutProps | void>;
    updateWorkOut({id, workout} : {id: string, workout: WorkoutProps}): Promise<WorkoutProps>;
}
