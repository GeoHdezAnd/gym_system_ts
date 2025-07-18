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
    AttendanceModel,
    TrainerModel,
} from "../models";
dotenv.config();

/**
 * Configuración de base de datos
 * Aqui se encuentra la información que necesita sequelize para conectar con la base de datos, en este momento es local
 */

export const db = new Sequelize({
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT as string, 10),
    dialect: PostgresDialect,
    timezone: "America/Mexico_City",
    logging: false,
    models: [
        UserModel,
        RoleModel,
        AdminModel,
        MemberModel,
        TrainerModel,
        PlansModel,
        SubscriptionModel,
        AttendanceModel,
    ],
});
