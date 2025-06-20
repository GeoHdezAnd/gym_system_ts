import { Role } from "../../domain/entities";
import { RoleRepository } from "../../domain/interfaces";
import { RoleModel } from "../models";

export class SequelizeRoleRepository implements RoleRepository {
    async create(name: string): Promise<Role> {
        const roleModel = await RoleModel.create({ name });

        return new Role({
            id: roleModel.id, // This is now guaranteed to exist after creation
            name: roleModel.name,
        });
    }

    async findByName(name: string): Promise<Role | null> {
        const roleModel = await RoleModel.findOne({ where: { name } });
        if (!roleModel) return null;
        return new Role(roleModel.get());
    }

}
