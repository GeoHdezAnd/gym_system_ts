import { MemberRepository, UserRepository } from "../../../domain/interfaces";
import { NotFoundError } from "../../../domain/errors";
import { TCreateUser } from "./create-member.usecase";
import { createMatricula } from "../../../utils/createMatricula";

export class UpdateMemberUseCase {
    constructor(
        private userRepository: UserRepository,
        private memberRepository: MemberRepository
    ) {}

    async execute(newData: TCreateUser, memberId: string): Promise<void> {
        // Usamos el repository para traer toda la entidad de user para una actualización de dato segura
        const userComplete = await this.userRepository.findById(memberId);

        if (!userComplete) {
            throw new NotFoundError("No se encontro el usuario");
        }
        // Usamos la entidad con su funcion para actualizar desde la entidad
        userComplete.updateByAdmin(newData);
        await this.userRepository.save(userComplete);

        if (
            newData.name ||
            newData.last_name ||
            newData.gender ||
            newData.born_date
        ) {
            const memberProfile = await this.memberRepository.getProfile(
                memberId
            );

            if (!memberProfile) {
                throw new NotFoundError("Perfil no encontrado");
            }
            const newMatricula = createMatricula(
                newData.name,
                newData.last_name,
                newData.phone
            );

            memberProfile.updateProfile(
                newData.gender,
                newData.born_date,
                newMatricula
            );

            await this.memberRepository.save(memberProfile);
        }
    }
}
