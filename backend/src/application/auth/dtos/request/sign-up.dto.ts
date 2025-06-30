export interface IBaseSignUpDto {
    name: string;
    last_name: string;
    email: string;
    password: string;
    phone: string;
}

export interface ISignUpDto extends IBaseSignUpDto {
    access_level: string;
}

export interface ISignUpMemberDto extends IBaseSignUpDto {
    gender: string;
    born_date: Date;
}

export interface ISignUpResultDto {
    id: string;
    name: string;
    last_name: string;
}

export class SignUpDto implements ISignUpResultDto {
    public readonly name: string;
    public readonly last_name: string;
    public readonly id: string;

    public constructor({ ...params }: ISignUpResultDto) {
        this.id = params.id;
        this.name = params.name;
        this.last_name = params.last_name;
    }
}
