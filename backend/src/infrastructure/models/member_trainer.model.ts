import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
} from "@sequelize/core";
import {
    Attribute,
    BelongsTo,
    Default,
    NotNull,
    PrimaryKey,
    Table,
    Unique,
} from "@sequelize/core/decorators-legacy";
import { MemberModel } from "./member.model";
import { TrainerModel } from "./trainer.model";
import { TProgress } from "../../domain/entities";

@Table({
    tableName: "member_trainer",
    timestamps: true,
})
export class MemberTrainerModel extends Model<
    InferAttributes<MemberTrainerModel>,
    InferCreationAttributes<MemberTrainerModel>
> {
    @Attribute(DataTypes.UUID)
    @Default(DataTypes.UUIDV4)
    @PrimaryKey
    declare id: CreationOptional<string>;

    @Attribute(DataTypes.UUID)
    @NotNull
    @Unique
    declare member_id: string;

    @Attribute(DataTypes.UUID)
    @NotNull
    declare trainer_id: string;

    @Attribute(DataTypes.TEXT)
    declare notes: CreationOptional<string>;

    @Attribute(DataTypes.STRING)
    declare goal: CreationOptional<string>;

    @Attribute(DataTypes.JSON)
    declare progress: CreationOptional<TProgress>;

    // LLAVES FORANEAS
    @BelongsTo(() => MemberModel, "member_id")
    declare member?: NonAttribute<MemberModel>;

    @BelongsTo(() => TrainerModel, "trainer_id")
    declare trainer?: NonAttribute<TrainerModel>;
}
