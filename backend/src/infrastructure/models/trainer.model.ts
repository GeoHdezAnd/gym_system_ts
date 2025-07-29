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
    declare bio: string;

    @Attribute(DataTypes.ARRAY(DataTypes.STRING))
    declare skills: string[];

    // Foreign Key users_model
    @BelongsTo(() => UserModel, {
        foreignKey: "user_id",
    })
    declare user_account?: NonAttribute<UserModel>;
}
