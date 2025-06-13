import { EmailService, TEmail } from "../../core/services";
import { transport } from "../config/nodemailer";

export class EmailServiceImpl implements EmailService {
    constructor() {}
    async sendConfirmationEmail(user: TEmail): Promise<void> {
        const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 8px; overflow: hidden;">
            <div style="background-color:rgb(59, 19, 19); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">KingsLayer Gym</h1>
            </div>
            
            <div style="padding: 20px;">
                <h2 style="color:rgb(93, 26, 26);">Hola ${user.name},</h2>
                <p style="line-height: 1.6;">¡Gracias por registrarte en KingsLayer Gym! Tu cuenta está casi lista.</p>
                
                <div style="background-color: #f7fafc; border-left: 4px solidrgb(93, 26, 35); padding: 12px; margin: 20px 0;">
                    <p style="margin: 0; font-weight: bold;">Usa este código para confirmar tu cuenta:</p>
                    <p style="margin: 10px 0 0; font-size: 24px; letter-spacing: 2px; color:rgb(93, 26, 26);">${user.token}</p>
                </div>
                
                <p style="line-height: 1.6;">O haz clic en el botón:</p>
                <a href="${process.env.FRONTEND_URL}confirm-account" 
                   style="display: inline-block; background-color:rgb(93, 26, 26); color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 4px; font-weight: bold; margin: 10px 0;">
                    Confirmar Cuenta
                </a>
                
                <p style="font-size: 12px; color: #718096; margin-top: 30px;">
                    Si no solicitaste este correo, puedes ignorarlo.
                </p>
            </div>
        </div>
        `;

        await transport.sendMail({
            from: "KingsLayer Gym <kingslayer@gym.com>",
            to: user.email,
            subject: "Confirma tu cuenta | KingsLayer Gym",
            html: html,
        });
    }

    async sendPasswordResetEmail(user: TEmail): Promise<void> {
        const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 8px; overflow: hidden;">
            <div style="background-color:rgb(59, 19, 19); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">KingsLayer Gym</h1>
            </div>
            
            <div style="padding: 20px;">
                <h2 style="color:rgb(93, 26, 26);">Hola ${user.name},</h2>
                <p style="line-height: 1.6;">¿Solicitaste reestablecer tu contraseña?</p>
                
                <div style="background-color:rgb(227, 227, 228); border-left: 4px solidrgb(93, 26, 35); padding: 12px; margin: 20px 0;">
                    <p style="margin: 0; font-weight: bold;">Usa este código para el formulario del enlace de abajo:</p>
                    <p style="margin: 10px 0 0; font-size: 24px; letter-spacing: 2px; color:rgb(93, 26, 26);">${user.token}</p>
                </div>
                
                <p style="line-height: 1.6;">Da click al botón para continuar:</p>
                <a href="${process.env.FRONTEND_URL}reset-password/${user.token}" 
                   style="display: inline-block; background-color:rgb(93, 26, 26); color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 4px; font-weight: bold; margin: 10px 0;">
                    Reestablecer contraseña
                </a>
                
                <p style="font-size: 12px; color: #718096; margin-top: 30px;">
                    Si no solicitaste este correo, puedes ignorarlo.
                </p>
            </div>
        </div>
        `;

        await transport.sendMail({
            from: "KingsLayer Gym <kingslayer@gym.com>",
            to: user.email,
            subject: "KingsLayer Gym | Reestablecer contraseña ",
            html: html,
        });
    }

    async sendCreatedUserGym(user: TEmail): Promise<void> {
        const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 8px; overflow: hidden;">
            <div style="background-color:rgb(59, 19, 19); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">KingsLayer Gym</h1>
            </div>
            
            <div style="padding: 20px;">
                <h2 style="color:rgb(93, 26, 26);">Hola ${user.name},</h2>
                <p style="line-height: 1.6;">¡Gracias por registrarte en KingsLayer Gym! Tu cuenta fue creada desde el panel de administración del gimnasio.</p>
                
                <div style="background-color: #f7fafc; border-left: 4px solidrgb(93, 26, 35); padding: 12px; margin: 20px 0;">
                <p style="margin: 0; font-weight: bold;">Despúes de confirmar tu cuenta te recomendamos solicitar el cambio de tu contraseña, actualmente la contraseña es tu matricula que fue proporcionada al registrarte en el gimnasio</p>
                    <p style="margin: 0; font-weight: bold;">Usa este código para confirmar tu cuenta:</p>
                    <p style="margin: 10px 0 0; font-size: 24px; letter-spacing: 2px; color:rgb(93, 26, 26);">${user.token}</p>
                </div>
                
                <p style="line-height: 1.6;">O haz clic en el botón:</p>
                <a href="${process.env.FRONTEND_URL}confirm-account" 
                   style="display: inline-block; background-color:rgb(93, 26, 26); color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 4px; font-weight: bold; margin: 10px 0;">
                    Confirmar Cuenta
                </a>
                
                <p style="font-size: 12px; color: #718096; margin-top: 30px;">
                    Si no solicitaste la creación de tu cuenta, puedes ignorarlo.
                </p>
            </div>
        </div>
        `;

        await transport.sendMail({
            from: "KingsLayer Gym <kingslayer@gym.com>",
            to: user.email,
            subject: "Confirma tu cuenta | KingsLayer Gym",
            html: html,
        });
    }
}
