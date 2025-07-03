import bcrypt from "bcrypt";
import { RoleModel } from "../models";
import { UserModel } from "../models/user.model";
import { AdminModel } from "../models/admin.model"

export async function runLoaders() {
    await loadDefaultRoles();
    await loadAdmin();
}


async function loadDefaultRoles() {
    const roles = ["admin", "member"];
    for(const role of roles){
        const exists = await RoleModel.findOne({where: {name: role}})
        if(!exists) {
            await RoleModel.create({name: role})
        }
    }
}

async function loadAdmin() {
    const adminEmail = "admin@gymapp.com";
    const exists = await UserModel.findOne({ where: { email: adminEmail } });
    if (exists) return;

    // Busca el rol admin
    const adminRole = await RoleModel.findOne({ where: { name: "admin" } });
    if (!adminRole) throw new Error("No existe el rol admin");

    // Hashea la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("superadmin", salt);

    // Crea el usuario
    const user = await UserModel.create({
        name: "admin",
        last_name: "super admin",
        email: adminEmail,
        phone: "1111111111",
        password: hashedPassword,
        confirmed: true,
        role_id: adminRole.id,
    });

    // Crea el perfil de admin
    await AdminModel.create({
        user_id: user.id,
        access_level: "full",
    });
}