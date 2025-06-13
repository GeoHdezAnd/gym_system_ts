import { PostgresDialect } from "@sequelize/postgres";
import { Member, User } from "../../domain/entities";
import {
    MemberRepository,
    RoleRepository,
    UserRepository,
} from "../../domain/interfaces";
import { ConflictError, NotFoundError } from "../../errors";
import { AuthService, EmailService } from "../../services";
import { Sequelize } from "@sequelize/core";
import { db } from "../../../infrastructure/config/db";
type InputMember = {
    name: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    gender: string;
    bornDate: Date;
};
export class SignUpMemberUseCase {
    constructor(
        private userRepository: UserRepository,
        private memberRepository: MemberRepository,
        private roleRepository: RoleRepository,
        private authService: AuthService,
        private emailService: EmailService
    ) {}

    async execute(input: InputMember): Promise<void> {
        // Iniciamos transacción manejable por si existen errores en datos revertir la operación en la base de datos

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

        const token = this.authService.generateToken();

        try {
            await db.transaction(async () => {
                const user = new User({
                    name: input.name,
                    lastName: input.lastName,
                    email: input.email,
                    phone: input.phone,
                    password: hashPassword,
                    token,
                    roleId: memberRole.id,
                });

                const createdUser = await this.userRepository.create(user);
                if (!createdUser) {
                    throw new Error();
                }

                // Crear perfil de member
                const member = new Member({
                    gender: input.gender,
                    bornDate: input.bornDate,
                    matricula: createdUser.createMatricula(),
                    userId: createdUser.id!, // Especificamos con "!" que la variable siempre existira
                });

                await this.memberRepository.create(member);

                // 5. Enviar email de confirmación
                await this.emailService.sendConfirmationEmail({
                    name: `${user.name} ${user.lastName}`,
                    email: user.email,
                    token: user.token!,
                });
            });
        } catch (error) {
            throw new Error();
        }
    }
}
