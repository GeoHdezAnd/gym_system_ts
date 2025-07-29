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
    Default,
    HasMany,
    NotNull,
    PrimaryKey,
    Table,
    Unique,
} from "@sequelize/core/decorators-legacy";
import { SubscriptionModel } from "./subscription.model";

@Table({
    tableName: "plans",
    timestamps: true,
})
export class PlansModel extends Model<
    InferAttributes<PlansModel>,
    InferCreationAttributes<PlansModel>
> {
    @Attribute(DataTypes.UUID)
    @Default(DataTypes.UUIDV4)
    @PrimaryKey
    declare id: CreationOptional<string>;

    @NotNull
    @Unique
    @Attribute(DataTypes.STRING(60))
    declare name: string;

    @NotNull
    @Attribute(DataTypes.STRING(70))
    declare description: string;

    @NotNull
    @Attribute(DataTypes.ARRAY(DataTypes.STRING(30)))
    declare benefits: string[];

    @NotNull
    @Attribute(DataTypes.DOUBLE)
    declare price: number;

    @NotNull
    @Attribute(DataTypes.INTEGER)
    declare duration_days: number;

    @Attribute(DataTypes.BOOLEAN)
    @Default(false)
    declare application_access: CreationOptional<boolean>;

    @Attribute(DataTypes.BOOLEAN)
    @Default(true)
    declare is_active: CreationOptional<boolean>;

    @Attribute(DataTypes.BOOLEAN)
    @Default(false)
    declare deleted: CreationOptional<boolean>;

    @Attribute(DataTypes.DATE)
    declare createdAt: CreationOptional<Date>;

    @Attribute(DataTypes.DATE)
    declare updatedAt: CreationOptional<Date>;

    // Foreign Key Suscriptions
    @HasMany(() => SubscriptionModel, {
        foreignKey: "plan_id",
        sourceKey: "id",
    })
    declare suscriptions?: NonAttribute<SubscriptionModel[]>;
}
