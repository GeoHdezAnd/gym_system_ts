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
    HasMany,
    NotNull,
    PrimaryKey,
    Table,
    Unique,
} from "@sequelize/core/decorators-legacy";
import { SubscriptionModel } from "./subscription.model";
import { UserModel } from "./user.model";
import { AttendanceModel } from "./attendance.model";
@Table({
    tableName: "members",
    timestamps: false,
    underscored: true,
})
export class MemberModel extends Model<
    InferAttributes<MemberModel>,
    InferCreationAttributes<MemberModel>
> {
    @Attribute(DataTypes.UUID)
    @Default(DataTypes.UUIDV4)
    @PrimaryKey
    declare id: CreationOptional<string>;

    // Foreign Key users_model
    @BelongsTo(() => UserModel, {
        foreignKey: "user_id",
    })
    declare user_account?: NonAttribute<UserModel>;

    @Attribute(DataTypes.STRING)
    @NotNull
    @Unique
    declare user_id: string;

    @Attribute(DataTypes.ENUM("M", "F"))
    @NotNull
    declare gender: string;

    @Attribute(DataTypes.DATEONLY)
    @NotNull
    declare born_date: Date;

    @Attribute(DataTypes.STRING)
    @NotNull
    @Unique
    declare matricula: string;

    // Relations
    @HasMany(() => SubscriptionModel, /* Foreign Key*/ "member_id")
    declare suscriptions?: NonAttribute<SubscriptionModel[]>;

    @HasMany(() => AttendanceModel, "member_id")
    declare attendances?: NonAttribute<AttendanceModel[]>;
}
