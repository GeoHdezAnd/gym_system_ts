import {
    InferAttributes,
    InferCreationAttributes,
    Model,
    DataTypes,
    CreationOptional,
    NonAttribute,
} from "@sequelize/core";
import {
    Attribute,
    BelongsTo,
    Default,
    NotNull,
    PrimaryKey,
    Table,
} from "@sequelize/core/decorators-legacy";
import { MemberTrainerModel } from "./member_trainer.model";
import { TExercises } from "../../domain/entities";

@Table({
    tableName: "workout",
    timestamps: true,
})
export class WorkoutModel extends Model<
    InferAttributes<WorkoutModel>,
    InferCreationAttributes<WorkoutModel>
> {
    @Attribute(DataTypes.UUID)
    @Default(DataTypes.UUIDV4)
    @PrimaryKey
    declare id: CreationOptional<string>;

    @Attribute(DataTypes.UUID)
    @NotNull
    declare relation_id: string;

    @Attribute(DataTypes.STRING(20))
    @NotNull
    declare name: string;

    @Attribute(DataTypes.DATEONLY)
    @Default(DataTypes.NOW)
    declare start_date: string;

    @NotNull
    @Attribute(DataTypes.DATEONLY)
    declare end_date: string;

    @Attribute(DataTypes.ARRAY(DataTypes.JSON))
    declare exercises: TExercises[];

    // LLaves foraneas
    @BelongsTo(() => MemberTrainerModel, "relation_id")
    declare relation?: NonAttribute<MemberTrainerModel>;
}
