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
} from "@sequelize/core/decorators-legacy";
import { MemberModel } from "./member.model";
import { PlansModel } from "./plans.model";

@Table({
    tableName: "suscriptions",
    underscored: true,
})
export class SubscriptionModel extends Model<
    InferAttributes<SubscriptionModel>,
    InferCreationAttributes<SubscriptionModel>
> {
    @Attribute(DataTypes.UUID)
    @Default(DataTypes.UUIDV4)
    @PrimaryKey
    declare id: CreationOptional<string>;

    // // Foreign Key member_id
    @BelongsTo(() => MemberModel, "memberId")
    declare member?: NonAttribute<MemberModel>;

    @ColumnName("member_id")
    @Attribute(DataTypes.UUID)
    @NotNull
    declare memberId: string;

    // Foreign Key plan_id
    @BelongsTo(() => PlansModel, "planId") // Relación muchos a uno (suscripción → plan)
    declare plan?: NonAttribute<PlansModel>;
    @ColumnName("plan_id")
    @Attribute(DataTypes.UUID)
    @NotNull
    declare planId: string;

    @ColumnName("start_date")
    @NotNull
    @Attribute(DataTypes.DATEONLY)
    declare startDate: Date;

    @ColumnName("end_date")
    @NotNull
    @Attribute(DataTypes.DATEONLY)
    declare endDate: Date;

    @Attribute(DataTypes.ENUM("active", "expired", "renewed"))
    @Default("active")
    @NotNull
    declare status: CreationOptional<string>;

    
}
