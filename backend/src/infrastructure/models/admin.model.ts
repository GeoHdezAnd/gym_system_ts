import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "@sequelize/core";
import {
    Attribute,
    Default,
    NotNull,
    PrimaryKey,
    Table,
    Unique,
} from "@sequelize/core/decorators-legacy";

@Table({
    tableName: "admins",
    timestamps: false
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

}
