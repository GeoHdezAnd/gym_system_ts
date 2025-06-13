import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
} from "@sequelize/core";
import {
    Table,
    Attribute,
    NotNull,
    PrimaryKey,
    AutoIncrement,
    HasMany,
    Unique,
} from "@sequelize/core/decorators-legacy";
import { UserModel } from "./user.model";

@Table({
    tableName: "roles",
})
export class RoleModel extends Model<
    InferAttributes<RoleModel>,
    InferCreationAttributes<RoleModel>
> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @NotNull
    @Unique
    @Attribute(DataTypes.ENUM("admin", "member", "trainer"))
    declare name: string;

    @HasMany(() => UserModel, "role_id")
    declare users: NonAttribute<UserModel[]>;
}
