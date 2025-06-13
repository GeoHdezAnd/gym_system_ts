import { Sequelize } from "@sequelize/core";
import { PostgresDialect } from "@sequelize/postgres";
import dotenv from "dotenv";
import {
    UserModel,
    AdminModel,
    RoleModel,
    MemberModel,
    PlansModel,
    SubscriptionModel,
    AttendanceModel
} from "../models";
dotenv.config();

export const db = new Sequelize({
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT as string, 10),
    dialect: PostgresDialect,
    logging: false,
    models: [
        UserModel,
        RoleModel,
        AdminModel,
        MemberModel,
        PlansModel,
        SubscriptionModel,
        AttendanceModel
    ],
});
