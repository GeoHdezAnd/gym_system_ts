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
    Unique,
    Default,
    HasOne,
    Attribute,
    NotNull,
    PrimaryKey,
    BelongsTo,
    ColumnName,
} from "@sequelize/core/decorators-legacy";
import { RoleModel } from "./role.model";
import { AdminModel } from "./admin.model";
import { MemberModel } from "./member.model";

@Table({
    tableName: "users",
    timestamps: true,
    underscored: true,
})
export class UserModel extends Model<
    InferAttributes<UserModel>,
    InferCreationAttributes<UserModel>
> {
    @Attribute(DataTypes.UUID)
    @Default(DataTypes.UUIDV4)
    @PrimaryKey
    declare id: CreationOptional<string>;

    @NotNull
    @Attribute(DataTypes.STRING(60))
    declare name: string;

    @NotNull
    @ColumnName("last_name")
    @Attribute(DataTypes.STRING(60))
    declare lastName: string;

    @Unique
    @NotNull
    @Attribute({
        type: DataTypes.STRING(30),
        validate: {
            isEmail: true,
        },
    })
    declare email: string;

    @Unique
    @NotNull
    @Attribute(DataTypes.STRING(10))
    declare phone: string;

    @Attribute(DataTypes.STRING(255))
    declare password: string;

    @Default(false)
    @Attribute(DataTypes.BOOLEAN)
    declare confirmed: CreationOptional<boolean>;

    @Attribute(DataTypes.STRING(6))
    declare token: string | null;

    @Attribute(DataTypes.INTEGER)
    @ColumnName("login_attempts")
    @Default(0)
    declare loginAttempts: CreationOptional<number>;

    @Attribute(DataTypes.BOOLEAN)
    @Default(false)
    declare deleted: CreationOptional<boolean>;

    @ColumnName("role_id")
    @Attribute(DataTypes.INTEGER)
    declare roleId: number; // Foreign key column

    // Relationships
    @BelongsTo(() => RoleModel, "role_id")
    declare role?: NonAttribute<RoleModel>;

    // 1 ... 1 Foreign key
    @HasOne(() => MemberModel, {
        foreignKey: "userId",
        inverse: { as: "memberProfile" }, // nombre explícito de la asociación
    })
    declare memberProfile?: NonAttribute<MemberModel>;

    // 1 ... 1 Foreign key
    @HasOne(() => AdminModel, "user_id")
    declare admin?: NonAttribute<AdminModel>;
}
