import { Member, User } from "../../../domain/entities";
import {
    MemberRepository,
    RoleRepository,
    UserRepository,
} from "../../../domain/interfaces";
import { ConflictError, NotFoundError } from "../../../errors";
import { AuthService, EmailService } from "../../../services";

export type TCreateUser = {
    name: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    bornDate: Date;
};

export class CreateMemberUseCase {
    constructor(
        private userRepository: UserRepository,
        private memberRepository: MemberRepository,
        private roleRepository: RoleRepository,
        private authService: AuthService,
        private emailService: EmailService
    ) {}

    async execute(input: TCreateUser): Promise<string> {
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
            input.lastName
        );

        const token = this.authService.generateToken();

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

        // Cambiamos password a la matricula del usuario para que sea seguro su primer ingreso
        const matricula = createdUser.createMatricula();
        const hash = await this.authService.hashPassword(matricula);
        createdUser.changePassword(hash);

        await this.userRepository.save(createdUser);
        await this.memberRepository.create(member);

        // 5. Envio de email de confirmación
        await this.emailService.sendCreatedUserGym({
            name: `${user.name} ${user.lastName}`,
            email: user.email,
            token: user.token!,
        });

        return matricula;
    }
}
