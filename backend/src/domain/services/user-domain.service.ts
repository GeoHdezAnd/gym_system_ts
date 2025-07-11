import { Role, User } from "../entities";
import { IAuthService } from "./auth.service";

export type TUser = {
    name: string;
    last_name: string;
    email: string;
    password: string;
    phone: string;
};

export interface UserDomainService {
    _authService: IAuthService;
    ensureUserDoesNotExist(email: string, phone: string): Promise<void>;
    getRoleorFail(roleName: string): Promise<Role>;
    buildUser(input: TUser, role_id: number): Promise<User>;
}
