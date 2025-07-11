export type TEmail = {
    name: string;
    email: string;
    token: string;
    matricula?: string;
};
export interface EmailService {
    sendConfirmationEmail(user: TEmail): Promise<void>;
    sendPasswordResetEmail(user: TEmail): Promise<void>;
    sendCreatedUserGym(user: TEmail): Promise<void>;
}
