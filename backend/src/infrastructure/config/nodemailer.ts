import nodemailer from 'nodemailer';

interface EmailConfig {
    host: string;
    port: number;
    auth: {
        user: string;
        pass: string;
    };
}

const getEmailConfig = (): EmailConfig => {
    const host = process.env.EMAIL_HOST;
    const port = process.env.EMAIL_PORT;
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASSWORD;

    if (!host || !user || !pass) {
        throw new Error('Faltan variables para la configuración de envio de email');
    }

    return {
        host,
        port: port ? parseInt(port, 10) : 2525,
        auth: {
            user,
            pass
        }
    };
};

export const transport = nodemailer.createTransport(getEmailConfig());