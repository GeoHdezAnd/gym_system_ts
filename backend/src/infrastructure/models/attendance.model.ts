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
    NotNull,
    PrimaryKey,
    Table,
    Unique,
} from "@sequelize/core/decorators-legacy";
import { MemberModel } from "./member.model";

@Table({
    tableName: "attendances",
    underscored: true,
    timestamps: false,
})
export class AttendanceModel extends Model<
    InferAttributes<AttendanceModel>,
    InferCreationAttributes<AttendanceModel>
> {
    @Attribute(DataTypes.UUID)
    @Default(DataTypes.UUIDV4)
    @PrimaryKey
    declare id: CreationOptional<string>;

    @BelongsTo(() => MemberModel, {
        foreignKey: "member_id",
    })
    declare member?: NonAttribute<MemberModel>;

    @Attribute(DataTypes.UUID)
    @NotNull
    declare member_id: string;

    @ColumnName("entry")
    @Attribute(DataTypes.DATE)
    @NotNull
    @Default(DataTypes.NOW)
    declare entry: CreationOptional<Date>;

    @ColumnName("exit")
    @Attribute(DataTypes.DATE)
    declare exit: CreationOptional<Date>;
}
