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
    ColumnName,
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
        foreignKey: "userId",
    })
    declare userAccount?: NonAttribute<UserModel>;

    @ColumnName("user_id")
    @Attribute(DataTypes.STRING)
    @NotNull
    @Unique
    declare userId: string;

    @Attribute(DataTypes.ENUM("M", "F"))
    @NotNull
    declare gender: string;

    @ColumnName("born_date")
    @Attribute(DataTypes.DATEONLY)
    @NotNull
    declare bornDate: Date;

    @Attribute(DataTypes.STRING)
    @NotNull
    @Unique
    declare matricula: string;

    // Relations
    @HasMany(() => SubscriptionModel, /* Foreign Key*/ "memberId")
    declare suscriptions?: NonAttribute<SubscriptionModel[]>;

    @HasMany(() => AttendanceModel, "memberId")
    declare attendances?: NonAttribute<AttendanceModel[]>;
}
