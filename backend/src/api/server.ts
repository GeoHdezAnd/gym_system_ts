/**
 * @file server.ts
 * @description Configuración y levantamiento del servidor Express para la API del sistema de gimnasio.
 * Incluye middlewares globales, rutas principales y conexión a la base de datos.
 *
 * @module ApiServer
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import colors from "colors";
import morgan from "morgan";
import { db } from "../infrastructure/config/db";
import authRouter from "./routes/auth.router";
import { errorHandler } from "./middleware";
import memberRouter from "./routes/member.router";
import planRouter from "./routes/plan.routes";
import suscriptionRouter from "./routes/suscription.router";
import attendecandeRouter from "./routes/attendance.router";
/**
 * Clase principal para levantar y configurar el servidor de la API.
 *
 * - Inicializa middlewares globales (CORS, JSON, logging, cookies).
 * - Define rutas principales para autenticación, miembros, planes, suscripciones y asistencias.
 * - Maneja la conexión a la base de datos.
 * - Incluye manejo global de errores.
 */
export class ApiServer {
    /**
     * Ejecuta el servidor en el puerto especificado.
     *
     * @async
     * @param {number} port - Puerto en el que correrá el servidor.
     * @returns {Promise<void>}
     *
     * @example
     * ApiServer.run(3000);
     */
    public static async run(port: number): Promise<void> {
        await this.connectDB();

        const app = express();

        app.use(morgan("dev"));
        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: false })); // convierte los datos que se mandan en HTML a un formato legible
        app.use(cookieParser());

        app.use("/api/auth", authRouter);
        app.use("/api/member", memberRouter);
        app.use("/api/plan", planRouter);
        app.use("/api/suscription", suscriptionRouter);
        app.use("/api/attendance", attendecandeRouter);
        app.use(errorHandler);

        app.listen(port, () => {
            console.log(
                colors.cyan.bold(
                    `REST API en el puerto ${port} con el entorno de ${process.env.NODE_ENV}`
                )
            );
        });
    }
    /**
     * Conecta a la base de datos utilizando Sequelize.
     *
     * @private
     * @async
     * @returns {Promise<void>}
     */
    private static async connectDB(): Promise<void> {
        try {
            await db.authenticate();
            db.sync(); // Esto permite que si creamos modelos nuevos se creeen en la base de datos si los tenemos especificados en la configuración de la DB
            console.log(colors.blue.bold("Conexión exitosa a la BD"));
        } catch (error) {
            console.log(colors.red.bold("Falló la conexión a la BD"));
        }
    }
}
