import {
    Model,
    InferAttributes,
    InferCreationAttributes,
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
    Unique,
} from "@sequelize/core/decorators-legacy";
import { UserModel } from "./user.model";
type Availability = {
    [day in
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
        | "sunday"]?: string[] | null;
};
@Table({
    tableName: "trainers",
    timestamps: false,
    underscored: true,
})
export class TrainerModel extends Model<
    InferAttributes<TrainerModel>,
    InferCreationAttributes<TrainerModel>
> {
    @Attribute(DataTypes.UUID)
    @Default(DataTypes.UUIDV4)
    @PrimaryKey
    declare id: CreationOptional<string>;

    @Attribute(DataTypes.UUID)
    @NotNull
    @Unique
    declare user_id: string;

    @Attribute(DataTypes.TEXT)
    declare bio: string | null;

    @Attribute(DataTypes.ARRAY(DataTypes.STRING))
    declare skills: string[];

    @Attribute(DataTypes.JSON)
    declare availability: Availability | {}; // Horarios del entrenador en JSON

    @Attribute(DataTypes.ARRAY(DataTypes.STRING))
    declare networks: string[] | null;

    // Foreign Key users_model
    @BelongsTo(() => UserModel, {
        foreignKey: "user_id",
    })
    declare user_account?: NonAttribute<UserModel>;
}
