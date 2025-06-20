import { User } from "../../domain/entities";
import { UserRepository } from "../../domain/interfaces";
import { NotFoundError } from "../../domain/errors";
import { UserModel } from "../models";

export class SequelizeUserRepository implements UserRepository {
    async create(user: User): Promise<User> {
        const userModel = await UserModel.create({
            name: user.name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            password: user.password,
            token: user.token,
            confirmed: user.confirmed,
            role_id: user.role_id,
        });

        const userData = userModel.get();
        return new User({
            id: userData.id,
            name: userData.name,
            last_name: userData.last_name,
            email: userData.email,
            phone: userData.phone,
            password: userData.password,
            confirmed: userData.confirmed,
            token: userData.token,
            login_attempts: userData.login_attempts,
            role_id: userData.role_id,
        });
    }

    async findByEmail(email: string): Promise<User | false> {
        const userModel = await UserModel.findOne({
            where: { email, deleted: false },
        });
        if (!userModel) return false;
        return new User(userModel.get());
    }

    async findByPhone(phone: string): Promise<User | false> {
        const userModel = await UserModel.findOne({
            where: { phone, deleted: false },
        });
        if (!userModel) return false;
        return new User(userModel.get());
    }
    async findByToken(token: string): Promise<User | false> {
        const userModel = await UserModel.findOne({
            where: { token, deleted: false },
        });
        if (!userModel) return false;
        return new User(userModel.get());
    }
    async findById(id: string): Promise<User | false> {
        const userModel = await UserModel.findByPk(
            id,

            { where: { deleted: false } }
        );
        if (!userModel) return false;
        return new User(userModel.get());
    }

    async save(user: User): Promise<void> {
        // Buscar el usuario existente en lugar de crear uno nuevo
        const userModel = await UserModel.findByPk(user.id!);
        if (!userModel) {
            throw new NotFoundError("Usuario no encontrado para actualizar");
        }

        // Actualizar solo los campos necesarios
        await userModel.update({
            name: user.name,
            last_name: user.last_name,
            phone: user.phone,
            password: user.password,
            confirmed: user.confirmed,
            deleted: user.deleted,
            token: user.token,
            login_attempts: user.login_attempts,
        });
    }
}
