import { Admin, User } from "../../domain/entities";
import { RoleRepository, UserRepository } from "../../domain/interfaces";
import { AdminRepository } from "../../domain/interfaces";
import { ConflictError } from "../../domain/errors";
import { IAuthService, EmailService } from "../../domain/services";
import { IUseCase } from "../../shared/IUseCase";
import { ISignUpDto, ISignUpResultDto } from "./dtos/request/sing-up-admin.dto";
import { createToken } from "../../utils";

export class SignUpAdminUseCase
    implements IUseCase<ISignUpDto, ISignUpResultDto>
{
    constructor(
        private _userRepository: UserRepository,
        private _adminRepository: AdminRepository,
        private _roleRepository: RoleRepository,
        private _authService: IAuthService,
        private _emailService: EmailService
    ) {}

    public async execute(input: ISignUpDto): Promise<ISignUpResultDto> {
        // 1. Verfificamos si el usuario existe
        const existingUser =
            (await this._userRepository.findByEmail(input.email)) ||
            (await this._userRepository.findByPhone(input.phone));
        if (existingUser) {
            throw new ConflictError("El usuario ya existe");
        }

        // 2. Obtener el rol del admin
        const adminRole = await this._roleRepository.findByName("admin");
        if (!adminRole) {
            throw new ConflictError("Rol de administrador no configurado");
        }

        // 3. Crear usuario
        const hashPassword = await this._authService.hashPassword(
            input.password
        );
        const token = createToken();

        const user = new User({
            name: input.name,
            last_name: input.last_name,
            email: input.email,
            phone: input.phone,
            password: hashPassword,
            token,
            role_id: adminRole.id,
        });

        const createdUser = await this._userRepository.create(user);

        if (!createdUser) {
            throw new Error("No se puede crear el usuario");
        }

        // Crear perfil de admin
        const admin = new Admin({
            user_id: createdUser.id!,
            access_level: input.access_level,
        });

        await this._adminRepository.create(admin);

        // 5. Enviar email de confirmación
        await this._emailService.sendConfirmationEmail({
            name: `${user.name} ${user.last_name}`,
            email: user.email,
            token: user.token!,
        });

        return {
            id: createdUser.id!,
            name: createdUser.name,
            last_name: createdUser.last_name,
        };
    }
}
