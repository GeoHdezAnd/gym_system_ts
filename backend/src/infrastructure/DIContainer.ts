import {
    AdminRepository,
    AttendanceRepository,
    MemberRepository,
    MemberTrainerRepository,
    PlanRepository,
    RoleRepository,
    SubscriptionRepository,
    TrainerRepository,
    UserRepository,
    WorkoutRepository,
} from "../domain/interfaces";
import {
    IAuthService,
    EmailService,
    UserDomainService,
} from "../domain/services";
import {
    CreateAttendanceUseCase,
    GetAllAttendancesWithMember,
} from "../application/admin/attendances";
import {
    DeleteUserUseCase,
    CreateMemberUseCase,
    GetAllMembersUseCase,
    UpdateMemberUseCase,
} from "../application/admin/members";
import {
    CreatePlanUseCase,
    UpdatePlanUseCase,
    DeletePlanUseCase,
    GetAllPlansUseCase,
} from "../application/admin/plans";
import {
    CreateSuscriptionUseCase,
    GetSuscriptionsUserUseCase,
} from "../application/admin/suscriptions";
import {
    SignInUseCase,
    SignUpMemberUseCase,
    ConfirmAccountUseCase,
    ForgotPasswordUseCase,
    ResetPasswordWTokenUseCase,
    SignUpAdminUseCase,
    ValidateTokenUseCase,
    CheckPasswordUseCase,
    UpdateCurrentPasswordUseCase,
} from "../application/auth";
import {
    SequelizeAdminRepository,
    SequelizePlanRepository,
    SequelizeRoleRepository,
    SequelizeUserRepository,
    SequelizeMemberRepository,
    SequelizeSubscriptionRepository,
    SequelizeAttendanceRepository,
    SequelizeTrainerRepository,
    SequelizeMemberTrainerRepository,
} from "./repositories";
import {
    AuthServiceImpl,
    EmailServiceImpl,
    UserDomainServiceImpl,
} from "./services";
import {
    CreateTrainerUseCase,
    UpdateTrainerUseCase,
    GetAllTrainersUseCase,
} from "../application/admin/trainer";
import {
    SelectTrainerUseCase,
    UpdateRelationUseCase,
} from "../application/memberApp";
import { GetRelationMemberTrainerUseCase } from "../application/memberApp/get-relation-member-trainer.usecase";
import {
    GetAdvisedUseCase,
    GetAllWorksoutUseCase,
} from "../application/trainerApp";
import { SequelizeWorkoutRepository } from "./repositories/workout.repository";

export class DIContainer {
    // Repositorios
    private static _userRepository: UserRepository =
        new SequelizeUserRepository();
    private static _adminRepository: AdminRepository =
        new SequelizeAdminRepository();
    private static _memberRepository: MemberRepository =
        new SequelizeMemberRepository();
    private static _roleRepository: RoleRepository =
        new SequelizeRoleRepository();
    private static _planRepository: PlanRepository =
        new SequelizePlanRepository();
    private static _subscriptionRepository: SubscriptionRepository =
        new SequelizeSubscriptionRepository();
    private static _attendanceRepository: AttendanceRepository =
        new SequelizeAttendanceRepository();
    private static _trainerRepository: TrainerRepository =
        new SequelizeTrainerRepository();
    private static _memberTrainerRepository: MemberTrainerRepository =
        new SequelizeMemberTrainerRepository();

    private static _workoutRepository: WorkoutRepository =
        new SequelizeWorkoutRepository();

    // Servicios
    private static _authService: IAuthService = new AuthServiceImpl();
    private static _emailService: EmailService = new EmailServiceImpl();
    private static _userDomainService: UserDomainService =
        new UserDomainServiceImpl(
            this._userRepository,
            this._roleRepository,
            this._authService
        );

    // Casos de uso AUTH
    static getSignUpAdminUseCase(): SignUpAdminUseCase {
        return new SignUpAdminUseCase(
            this._userDomainService,
            this._userRepository,
            this._adminRepository,
            this._emailService
        );
    }

    static getSignUpMemberUseCase(): SignUpMemberUseCase {
        return new SignUpMemberUseCase(
            this._userDomainService,
            this._userRepository,
            this._memberRepository,
            this._emailService
        );
    }
    static getSignInUseCase(): SignInUseCase {
        return new SignInUseCase(this._userRepository, this._authService);
    }

    static getConfirmAccountUseCase(): ConfirmAccountUseCase {
        return new ConfirmAccountUseCase(this._userRepository);
    }

    static getForgotPasswordUseCase(): ForgotPasswordUseCase {
        return new ForgotPasswordUseCase(
            this._userRepository,
            this._emailService
        );
    }

    static getResetPasswordWTokenUseCase(): ResetPasswordWTokenUseCase {
        return new ResetPasswordWTokenUseCase(
            this._userRepository,
            this._authService
        );
    }

    static getUpdateCurrentPasswordUseCase(): UpdateCurrentPasswordUseCase {
        return new UpdateCurrentPasswordUseCase(
            this._userRepository,
            this._authService
        );
    }

    static getCheckPasswordUseCase(): CheckPasswordUseCase {
        return new CheckPasswordUseCase(
            this._userRepository,
            this._authService
        );
    }

    static getValidateTokenUseCase(): ValidateTokenUseCase {
        return new ValidateTokenUseCase(this._userRepository);
    }

    // Casos de uso MEMBERS
    static getCreateMemberUseCase(): CreateMemberUseCase {
        return new CreateMemberUseCase(
            this._userDomainService,
            this._userRepository,
            this._memberRepository,
            this._emailService
        );
    }

    static getMembersUseCase(): GetAllMembersUseCase {
        return new GetAllMembersUseCase(this._memberRepository);
    }

    static getUpdateMemberUseCase(): UpdateMemberUseCase {
        return new UpdateMemberUseCase(
            this._userRepository,
            this._memberRepository
        );
    }

    static getDeleteUserUseCase(): DeleteUserUseCase {
        return new DeleteUserUseCase(this._userRepository);
    }

    // Casos de uso de PLANES
    static getPlansUseCase(): GetAllPlansUseCase {
        return new GetAllPlansUseCase(this._planRepository);
    }

    static getCreatePlanUseCase(): CreatePlanUseCase {
        return new CreatePlanUseCase(this._planRepository);
    }

    static getUpdatePlanUseCase(): UpdatePlanUseCase {
        return new UpdatePlanUseCase(this._planRepository);
    }

    static getDeletePlanUseCase(): DeletePlanUseCase {
        return new DeletePlanUseCase(this._planRepository);
    }

    // Casos de uso de SUSCRIPTION
    static getCreateSuscriptionUseCase(): CreateSuscriptionUseCase {
        return new CreateSuscriptionUseCase(
            this._memberRepository,
            this._planRepository,
            this._subscriptionRepository
        );
    }

    static getAllSuscriptionsUserUseCase(): GetSuscriptionsUserUseCase {
        return new GetSuscriptionsUserUseCase(
            this._memberRepository,
            this._subscriptionRepository
        );
    }

    // Casos de uso de asistencias
    static getAllAttendances(): GetAllAttendancesWithMember {
        return new GetAllAttendancesWithMember(this._attendanceRepository);
    }

    static getCreateAttendance(): CreateAttendanceUseCase {
        return new CreateAttendanceUseCase(
            this._attendanceRepository,
            this._memberRepository,
            this._subscriptionRepository
        );
    }

    // Casos de uso de entrenadores
    static getAllTrainersUseCase(): GetAllTrainersUseCase {
        return new GetAllTrainersUseCase(this._trainerRepository);
    }
    static createTrainerUseCase(): CreateTrainerUseCase {
        return new CreateTrainerUseCase(
            this._userDomainService,
            this._userRepository,
            this._trainerRepository
        );
    }

    static getUpdateTrainerUseCase(): UpdateTrainerUseCase {
        return new UpdateTrainerUseCase(
            this._userRepository,
            this._trainerRepository
        );
    }

    // Relacion cliente con entrenador
    static getSelectTrainerUseCase(): SelectTrainerUseCase {
        return new SelectTrainerUseCase(
            this._memberRepository,
            this._trainerRepository,
            this._memberTrainerRepository
        );
    }

    static getGetRelationMemberTrainerUseCase(): GetRelationMemberTrainerUseCase {
        return new GetRelationMemberTrainerUseCase(
            this._memberRepository,
            this._memberTrainerRepository
        );
    }

    static updateRelationUseCase(): UpdateRelationUseCase {
        return new UpdateRelationUseCase(
            this._memberTrainerRepository,
            this._trainerRepository
        );
    }

    static getAdvisedUseCase(): GetAdvisedUseCase {
        return new GetAdvisedUseCase(
            this._trainerRepository,
            this._memberTrainerRepository
        );
    }

    static getAllWorksOutUseCase(): GetAllWorksoutUseCase {
        return new GetAllWorksoutUseCase(this._workoutRepository);
    }
}
