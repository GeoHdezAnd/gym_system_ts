import { Role } from "../entities"

export interface RoleRepository {
    create(name: string): Promise<Role>
    findByName(name: string): Promise<Role | null>
}