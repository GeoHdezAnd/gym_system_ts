import { WorkoutProps } from "../entities";

export interface WorkoutRepository {
    getAllByRelationId(relation_id: string): Promise<WorkoutProps[] | []>;
}
