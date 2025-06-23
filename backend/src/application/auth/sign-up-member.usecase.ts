import { Member, User } from "../../domain/entities";
import {
    MemberRepository,
    RoleRepository,
    UserRepository,
} from "../../domain/interfaces";
import { ConflictError, NotFoundError } from "../../domain/errors";
import { IAuthService, EmailService } from "../../domain/services";
import { db } from "../../infrastructure/config/db";
import { createToken } from "../../utils";
type InputMember = {
    name: string;
    last_name: string;
    email: string;
    password: string;
    phone: string;
    gender: string;
    born_date: Date;
};
export class SignUpMemberUseCase {
    constructor(
        private userRepository: UserRepository,
        private memberRepository: MemberRepository,
        private roleRepository: RoleRepository,
        private authService: IAuthService,
        private emailService: EmailService
    ) {}

    async execute(input: InputMember): Promise<void> {
        // 1. Verfificamos si el usuario existe
        const existingUser =
            (await this.userRepository.findByEmail(input.email)) ||
            (await this.userRepository.findByPhone(input.phone));
        if (existingUser) {
            throw new ConflictError("El usuario ya existe");
        }
        // 2. Obtener el rol del member
        const memberRole = await this.roleRepository.findByName("member");
        if (!memberRole) {
            throw new NotFoundError("Rol de member no configurado");
        }

        // 3. Crear usuario
        const hashPassword = await this.authService.hashPassword(
            input.password
        );

        const token = createToken();

        try {
            await db.transaction(async () => {
                const user = new User({
                    name: input.name,
                    last_name: input.last_name,
                    email: input.email,
                    phone: input.phone,
                    password: hashPassword,
                    token,
                    role_id: memberRole.id,
                });

                const createdUser = await this.userRepository.create(user);

                if (!createdUser) {
                    throw new Error("No fue posible crear el usuario");
                }

                // Crear perfil de member
                const member = new Member({
                    gender: input.gender,
                    born_date: input.born_date,
                    matricula: createdUser.createMatricula(),
                    user_id: createdUser.id!, // Especificamos con "!" que la variable siempre existira
                });
                if (!member) {
                    throw new Error(
                        "No fue posible crear el perfil de miembro"
                    );
                }

                await this.memberRepository.create(member);

                // 5. Enviar email de confirmación
                await this.emailService.sendConfirmationEmail({
                    name: `${user.name} ${user.last_name}`,
                    email: user.email,
                    token: user.token!,
                });
            });
        } catch (error) {
            throw new Error();
        }
    }
}
