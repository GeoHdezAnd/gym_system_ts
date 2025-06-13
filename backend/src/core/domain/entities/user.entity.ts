import { UnauthorizedError } from "../../errors";
import { TCreateUser } from "../../use-case/admin/members";
import { Member } from "./member.entity";

export interface UserProps {
    id?: string;
    name: string;
    lastName: string;
    email: string;
    phone: string;
    password?: string;
    confirmed?: boolean;
    token?: string | null;
    loginAttempts?: number;
    deleted?: boolean;
    roleId: number;
}

export class User {
    constructor(private readonly props: UserProps) {}

    get id(): string | undefined {
        return this.props.id;
    }
    get name(): string {
        return this.props.name;
    }
    get lastName(): string {
        return this.props.lastName;
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

    get loginAttempts(): number | undefined {
        return this.props.loginAttempts;
    }
    get roleId(): number {
        return this.props.roleId;
    }

    updateToken(token: string): void {
        // if (this.token !== null) {
        //     throw new UnauthorizedError(
        //         "
        //     );
        // }
        this.props.token = token;
    }

    createMatricula(): string {
        const nameInitials = this.name.slice(0, 2).toUpperCase();
        const lastNameInitials = this.lastName.slice(0, 2).toUpperCase();
        const telInitials = this.phone.slice(-4);

        return `${nameInitials}${lastNameInitials}-${telInitials}`;
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
        this.props.loginAttempts = (this.props.loginAttempts || 0) + 1;
    }

    resetLoginAttempts(): void {
        this.props.loginAttempts = 0;
    }

    updateByAdmin({
        name,
        lastName,
        email,
        phone,
    }: Partial<TCreateUser>): void {
        if (name) this.props.name = name;
        if (lastName) this.props.lastName = lastName;
        if (email) this.props.email = email;
        if (phone) this.props.phone = phone;
    }
    deleteAccount(): void {
        this.props.deleted = true;
    }
}
