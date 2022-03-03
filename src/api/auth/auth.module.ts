import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmailVerification } from "./entities/EmailVerification.entity";
import { PassportModule } from "@nestjs/passport";
import { User } from "../user/entities/user.entity";
import { LocalStrategy } from "./strategy/local.strategy";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "../../config/jwt";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, EmailVerification]),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: "3d" },
        }),
        PassportModule.register({
            session: true,
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
