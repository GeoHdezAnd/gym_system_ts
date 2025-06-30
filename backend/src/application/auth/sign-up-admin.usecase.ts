import { Admin } from "../../domain/entities";
import { ConflictError } from "../../domain/errors";
import { AdminRepository, UserRepository } from "../../domain/interfaces";
import { EmailService, UserDomainService } from "../../domain/services";
import { IUseCase } from "../../shared/IUseCase";
import {
    ISignUpDto,
    ISignUpResultDto,
    SignUpDto,
} from "./dtos/request/sign-up.dto";

/**
 * Caso de uso para registrar un nuevo administrador.
 *
 * - Verifica que el usuario no exista previamente.
 * - Obtiene el rol de administrador.
 * - Crea el usuario y su perfil de administrador.
 * - Envía un email de confirmación.
 *
 * @param input Datos del nuevo administrador.
 * @returns Datos básicos del administrador creado.
 * @throws ConflictError si el usuario ya existe o no se puede crear.
 */
export class SignUpAdminUseCase
    implements IUseCase<ISignUpDto, ISignUpResultDto>
{
    constructor(
        private readonly _userDomainService: UserDomainService,
        private readonly _userRepository: UserRepository,
        private readonly _adminRepository: AdminRepository,
        private readonly _emailService: EmailService
    ) {}

    public async execute(input: ISignUpDto): Promise<ISignUpResultDto> {
        // 1. Verfificamos si el usuario existe
        await this._userDomainService.ensureUserDoesNotExist(
            input.email,
            input.phone
        );

        // 2. Obtener el rol del admin
        const adminRole = await this._userDomainService.getRoleorFail("admin");

        // 3. Crear usuario
        const user = await this._userDomainService.buildUser(
            input,
            adminRole.id
        );

        const createdUser = await this._userRepository.create(user);
        if (!createdUser) {
            throw new ConflictError("No se puede crear el usuario");
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

        return new SignUpDto({
            id: createdUser.id!,
            name: createdUser.name,
            last_name: createdUser.last_name,
        });
    }
}
