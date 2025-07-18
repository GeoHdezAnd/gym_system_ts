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
    @BelongsTo(() => MemberModel, "member_id")
    declare member?: NonAttribute<MemberModel>;

    @Attribute(DataTypes.UUID)
    @NotNull
    declare member_id: string;

    // Foreign Key plan_id
    @BelongsTo(() => PlansModel, "plan_id") // Relación muchos a uno (suscripción → plan)
    declare plan?: NonAttribute<PlansModel>;
    @Attribute(DataTypes.UUID)
    @NotNull
    declare plan_id: string;

    @Attribute(DataTypes.DATEONLY)
    @Default(DataTypes.NOW)
    declare start_date: Date;

    @NotNull
    @Attribute(DataTypes.DATEONLY)
    declare end_date: Date;

    @Attribute(DataTypes.ENUM("active", "expired", "renewed"))
    @Default("active")
    @NotNull
    declare status: CreationOptional<string>;
}
