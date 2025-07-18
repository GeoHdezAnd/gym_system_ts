import { User, UserProps } from "../entities";
export interface UserRepository {
    create(user: UserProps): Promise<UserProps>;
    findByEmail(email: string): Promise<User | false>;
    findByPhone(phone: string): Promise<User | false>;
    findByToken(token: string): Promise<User | false>;
    findById(id: string): Promise<User | false>;
    save(user: User): Promise<void>;
}
