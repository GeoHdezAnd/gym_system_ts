import { createToken } from "../../utils";
import { Role, User } from "../../domain/entities";
import { ConflictError, NotFoundError } from "../../domain/errors";
import { RoleRepository, UserRepository } from "../../domain/interfaces";
import { IAuthService, UserDomainService } from "../../domain/services";
import { createMatricula } from "../../utils/createMatricula";

type TUser = {
    name: string;
    last_name: string;
    email: string;
    password?: string;
    phone: string;
};

export class UserDomainServiceImpl implements UserDomainService {
    constructor(
        private _userRepository: UserRepository,
        private readonly _roleRepository: RoleRepository,
        public _authService: IAuthService
    ) {}

    async ensureUserDoesNotExist(email: string, phone: string) {
        const existingUser =
            (await this._userRepository.findByEmail(email)) ||
            (await this._userRepository.findByPhone(phone));

        if (existingUser) {
            throw new ConflictError("El usuario ya existe");
        }
    }

    async getRoleorFail(roleName: string): Promise<Role> {
        const role = await this._roleRepository.findByName(roleName);
        if (!role) {
            throw new NotFoundError(`Rol de ${roleName} no configurado`);
        }
        return role;
    }

    async buildUser(input: TUser, role_id: number): Promise<User> {
        const token = createToken();
        const hashPassword = await this._authService.hashPassword(
            input.password ||
                createMatricula(input.name, input.last_name, input.phone)
        );

        return new User({
            ...input,
            password: hashPassword,
            token,
            role_id,
        });
    }
}
