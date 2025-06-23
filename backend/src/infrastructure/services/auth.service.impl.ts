import { IAuthService } from "../../domain/services";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthServiceImpl implements IAuthService {
    constructor() {}
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    async comparePassword(
        password: string,
        hashedPassword: string
    ): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }


    generateJWT(id: string): string {
        if (!process.env.JWT_SECRET) {
            throw new Error(
                "JWT_SECRET no está definida como variable de entorno"
            );
        }

        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        return token;
    }
}
