import { User } from "../entities";
export interface UserRepository {
    create(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | false>;
    findByPhone(phone: string): Promise<User | false>;
    findByToken(token: string): Promise<User | false>;
    findById(id: string): Promise<User | false>;
    save(user: User): Promise<void>;
}
