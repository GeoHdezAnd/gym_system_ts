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
import { UserModel } from "./user.model";

@Table({
    tableName: "admins",
    timestamps: false,
})
export class AdminModel extends Model<
    InferAttributes<AdminModel>,
    InferCreationAttributes<AdminModel>
> {
    @Attribute(DataTypes.UUID)
    @Default(DataTypes.UUIDV4)
    @PrimaryKey
    declare id: CreationOptional<string>;

    @Attribute(DataTypes.ENUM("full", "limited"))
    declare access_level: string;

    @Attribute(DataTypes.UUID)
    @NotNull
    @Unique
    declare user_id: string;

    // Relations
    @BelongsTo(() => UserModel, {
        foreignKey: "user_id",
    })
    declare user_account?: NonAttribute<UserModel>;
}
