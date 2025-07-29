import { Member } from "../../domain/entities";
import { MemberRepository, UserRepository } from "../../domain/interfaces";
import { EmailService, UserDomainService } from "../../domain/services";
import { db } from "../../infrastructure/config/db";
import { IUseCase } from "../../shared/IUseCase";
import { createMatricula } from "../../utils/createMatricula";
import {
    ISignUpMemberDto,
    ISignUpResultDto,
    SignUpDto,
} from "../../domain/dtos/sign-up.dto";

export class SignUpMemberUseCase
    implements IUseCase<ISignUpMemberDto, ISignUpResultDto | undefined>
{
    constructor(
        private readonly _userDomainService: UserDomainService,
        private readonly _userRepository: UserRepository,
        private readonly _memberRepository: MemberRepository,
        private readonly _emailService: EmailService
    ) {}

    /**
     * Ejecuta el registro de miembro.
     */
    async execute(
        input: ISignUpMemberDto
    ): Promise<ISignUpResultDto | undefined> {
        // 1. Verfificamos si el usuario existe
        await this._userDomainService.ensureUserDoesNotExist(
            input.email,
            input.phone
        );

        // 2. Obtener el rol del miembro
        const memberRole = await this._userDomainService.getRoleorFail(
            "member"
        );

        // 3. Crear usuario
        const user = await this._userDomainService.buildUser(
            input,
            memberRole.id
        );

        let result: ISignUpResultDto | undefined;

        try {
            await db.transaction(async () => {
                const createdUser = await this._userRepository.create(user);

                if (!createdUser) {
                    throw new Error("No fue posible crear el usuario");
                }

                // Crear perfil de member
                const member = new Member({
                    gender: input.gender,
                    born_date: input.born_date,
                    matricula: createMatricula(
                        input.name,
                        input.last_name,
                        input.phone
                    ),
                    user_id: createdUser.id!, // Especificamos con "!" que la variable siempre existira
                });
                if (!member) {
                    throw new Error(
                        "No fue posible crear el perfil de miembro"
                    );
                }

                await this._memberRepository.create(member);

                // 5. Enviar email de confirmación, es escencial para garantizar seguridad
                await this._emailService.sendConfirmationEmail({
                    name: `${user.name} ${user.last_name}`,
                    email: user.email,
                    token: user.token!,
                });

                result = new SignUpDto({
                    id: createdUser.id!,
                    name: createdUser.name,
                    last_name: createdUser.last_name,
                });
            });

            return result;
        } catch (error) {
            throw new Error("Error al registrar el miembro, intente de nuevo");
        }
    }
}
