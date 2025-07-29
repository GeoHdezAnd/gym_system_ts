import { TCreateUser } from "../../application/admin/members";
import { ForbiddenError } from "../errors";

export interface UserProps {
    id?: string;
    name: string;
    last_name: string;
    email: string;
    phone: string;
    password?: string;
    confirmed?: boolean;
    token?: string | null;
    login_attempts?: number;
    deleted?: boolean;
    role_id: number;
    rol?: string;
}

export class User {
    constructor(private readonly props: UserProps) {}

    get id(): string | undefined {
        return this.props.id;
    }
    get name(): string {
        return this.props.name;
    }
    get last_name(): string {
        return this.props.last_name;
    }
    get email(): string {
        return this.props.email;
    }
    get phone(): string {
        return this.props.phone;
    }
    get password(): string {
        return this.props.password!;
    }
    get confirmed(): boolean {
        return !!this.props.confirmed;
    }
    get token(): string | null | undefined {
        return this.props.token;
    }
    get deleted(): boolean | undefined {
        return this.props.deleted;
    }

    get login_attempts(): number | undefined {
        return this.props.login_attempts;
    }
    get role_id(): number {
        return this.props.role_id;
    }
    get role(): string {
        return this.props.rol || "";
    }

    updateToken(token: string): void {
        this.props.token = token;
    }

    confirmAccount(): void {
        this.props.confirmed = true;
        this.props.token = null;
    }

    changePassword(hash: string): void {
        this.props.password = hash;
        if (!this.props.confirmed) {
            return;
        }
        this.props.token = null;
    }

    incrementLoginAttempts(): void {
        const maxAttempts = 5;

        if (this.props.login_attempts! >= maxAttempts) {
            throw new ForbiddenError(
                "Cuenta bloqueada por demasiados intentos fallidos, solicita cambio de contraseña"
            );
        }

        this.props.login_attempts = (this.props.login_attempts || 0) + 1;
    }

    resetLoginAttempts(): void {
        this.props.login_attempts = 0;
    }

    updateByAdmin({
        name,
        last_name,
        email,
        phone,
    }: Partial<TCreateUser>): void {
        if (name) this.props.name = name;
        if (last_name) this.props.last_name = last_name;
        if (email) this.props.email = email;
        if (phone) this.props.phone = phone;
    }
    deleteAccount(): void {
        this.props.deleted = true;
    }

    restoreAccount(): void {
        this.props.deleted;
    }
}
