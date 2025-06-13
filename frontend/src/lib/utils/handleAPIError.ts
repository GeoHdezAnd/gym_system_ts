import { isAxiosError } from "axios";

export const handleApiError = (error: unknown): string => {
    // Error de validación con estructura específica
    if (isAxiosError(error) && error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        if (Array.isArray(validationErrors) && validationErrors.length > 0) {
            return validationErrors[0].msg || "Datos inválidos";
        }
    }

    // Error con mensaje directo
    if (isAxiosError(error) && error.response?.data?.error.message) {
        return error.response.data.error.message;
    }

    // Error estándar de Axios
    if (isAxiosError(error)) {
        return error.message || "Error en la solicitud";
    }

    // Error inesperado
    return "Error desconocido";
};
