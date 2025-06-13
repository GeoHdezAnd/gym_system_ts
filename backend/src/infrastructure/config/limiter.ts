import { rateLimit } from "express-rate-limit";

/**
 * Middleware de limitación de tasa (rate limiting) para Express
 * @module rateLimiter
 * @property {number} windowMs - Ventana de tiempo en milisegundos para contar las peticiones (1 minuto)
 * @property {number} limit - Número máximo de peticiones permitidas por ventana de tiempo
 *                      (5 en producción, 1000 en otros entornos)
 * @property {Object} message - Mensaje de error cuando se excede el límite
 * @property {string} message.error - Texto del mensaje de error
 **/
export const limiter = rateLimit({
    windowMs: 60 * 1000,
    limit: process.env.NODE_ENV === "production" ? 5 : 1000,
    message: { "error": "Haz alcanzado el limite de peticiones" },
});
