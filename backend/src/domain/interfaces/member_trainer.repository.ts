import { RequestPropsRelation } from "../../application/memberApp";
import { ResponseAdvisedDto } from "../dtos/advised.dto";
import { MemberTrainer } from "../entities";

export interface MemberTrainerRepository {
    getById(id: string): Promise<MemberTrainer>;
    getByMemberId(member_id: string): Promise<MemberTrainer | null>;
    getAdvisedByTrainerId(trainer_id: string): Promise<ResponseAdvisedDto[] | []>;
    create(memberTrainer: MemberTrainer): Promise<MemberTrainer>;
    update(data: RequestPropsRelation): Promise<void>;
}
