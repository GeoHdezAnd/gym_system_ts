import { Member } from "../../../domain/entities";
import { MemberRepository, UserRepository } from "../../../domain/interfaces";
import { EmailService, UserDomainService } from "../../../domain/services";
import { createMatricula } from "../../../utils/createMatricula";

export type TCreateUser = {
    name: string;
    last_name: string;
    email: string;
    phone: string;
    gender: string;
    born_date: Date;
};

export class CreateMemberUseCase {
    constructor(
        private _userDomainService: UserDomainService,
        private _userRepository: UserRepository,
        private _memberRepository: MemberRepository,
        private _emailService: EmailService
    ) {}

    async execute(input: TCreateUser): Promise<string> {
        // 1. Verificar si el usuario existe
        await this._userDomainService.ensureUserDoesNotExist(
            input.email,
            input.phone
        );

        // 2. Obtener el rol de miembro
        const memberRole = await this._userDomainService.getRoleorFail(
            "member"
        );

        // 3. Crear usuario
        const user = await this._userDomainService.buildUser(
            {
                name: input.name,
                last_name: input.last_name,
                email: input.email,
                phone: input.phone,
            },
            memberRole.id
        );

        // 4. Guardar usuario
        const createdUser = await this._userRepository.create(user);
        if (!createdUser) {
            throw new Error("No fue posible crear el usuario");
        }

        // 5. Crear perfil de miembro
        const member = new Member({
            gender: input.gender,
            born_date: input.born_date,
            matricula: createMatricula(
                input.name,
                input.last_name,
                input.phone
            ),
            user_id: createdUser.id!,
        });
        await this._memberRepository.create(member);

        // 6. Enviar email de bienvenida con matrícula
        await this._emailService.sendCreatedUserGym({
            name: `${user.name} ${user.last_name}`,
            email: user.email,
            token: user.token!,
            matricula: member.matricula,
        });

        return member.matricula;
    }
}
