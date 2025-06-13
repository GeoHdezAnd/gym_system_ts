import { Admin, User } from "../../domain/entities";
import { RoleRepository, UserRepository } from "../../domain/interfaces";
import { AdminRepository } from "../../domain/interfaces";
import { ConflictError } from "../../errors";
import { AuthService, EmailService } from "../../services";

type InputAdmin =  {
    name: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    accessLevel: string;
}

export class SignUpAdminUseCase {
    constructor(
        private userRepository: UserRepository,
        private adminRepository: AdminRepository,
        private roleRepository: RoleRepository,
        private authService: AuthService,
        private emailService: EmailService
    ) {}

    async execute(input: InputAdmin): Promise<void> {
        // 1. Verfificamos si el usuario existe
        const existingUser =
            (await this.userRepository.findByEmail(input.email)) ||
            await this.userRepository.findByPhone(input.phone);
        if (existingUser) {
            throw new ConflictError("El usuario ya existe");
        }

        // 2. Obtener el rol del admin
        const adminRole = await this.roleRepository.findByName("admin");
        if (!adminRole) {
            throw new ConflictError("Rol de administrador no configurado");
        }

        // 3. Crear usuario
        const hashPassword = await this.authService.hashPassword(
            input.password
        );
        const token = this.authService.generateToken();

        const user = new User({
            name: input.name,
            lastName: input.lastName,
            email: input.email,
            phone: input.phone,
            password: hashPassword,
            token,
            roleId: adminRole.id,
        });

        const createdUser = await this.userRepository.create(user);

        if (!createdUser) {
            throw new Error();
        }

        // Crear perfil de admin
        const admin = new Admin({
            userId: createdUser.id!,
            accessLevel: input.accessLevel,
        });

        await this.adminRepository.create(admin);

        // 5. Enviar email de confirmación
        await this.emailService.sendConfirmationEmail({
            name: `${user.name} ${user.lastName}`,
            email: user.email,
            token: user.token!
        })
    }
}
