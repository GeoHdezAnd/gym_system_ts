import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import colors from "colors";
import morgan from "morgan";
import { db } from "./infrastructure/config/db";
import authRouter from "./api/routes/auth.router";
import { errorHandler } from "./api/middleware";
import memberRouter from "./api/routes/member.router";
import planRouter from "./api/routes/plan.routes";
import suscriptionRouter from "./api/routes/suscription.router";
import attendecandeRouter from "./api/routes/attendance.router";
async function connectDB() {
    try {
        await db.authenticate();
        db.sync(); // ACTIVAR SI SE CREARAN NUEVAS TABLAS PERO CUIDADO PORQUE CREARA LA TABLA DE LA VISTA DE VENTAS, ESA TABLA NO DEBE EXISTIR COMO TABLA, ES UNA VISTA
        console.log(colors.blue.bold("Conexión exitosa a la BD"));
    } catch (error) {
        console.log(colors.red.bold("Falló la conexión a la BD"));
    }
}

connectDB();

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
app.use("/api/attendance", attendecandeRouter)
app.use(errorHandler);

export default app;
