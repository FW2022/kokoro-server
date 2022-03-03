import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Request,
    UseGuards,
    Response,
} from "@nestjs/common";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { User } from "../user/entities/user.entity";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guard/jwt-auth.guard";
import { LocalAuthGuard } from "./guard/local-auth.guard";

@Controller("api/auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("sign-up")
    async signUp(
        @Response({ passthrough: true }) res,
        @Body() userArg: CreateUserDto
    ) {
        try {
            const user = await this.authService.signUp(userArg);

            if (user["token"]) {
                res.setHeader(
                    "Set-Cookie",
                    `access_token=${user["token"]}; path=/;`
                );
            }

            delete user.password;
            return user;
        } catch (err) {
            throw err;
        }
    }

    @UseGuards(LocalAuthGuard)
    @Post("sign-in")
    async signIn(@Request() req, @Response({ passthrough: true }) res) {
        try {
            const user: User = req.user;

            if (user["token"]) {
                res.setHeader(
                    "Set-Cookie",
                    `access_token=${user["token"]}; path=/;`
                );
            }

            if (!user.roles.some((v) => v === "EmailVerified")) {
                await this.authService.sendEmailVerification(
                    user.id,
                    user.email
                );
            }

            return user;
        } catch (err) {
            throw err;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post("sign-out")
    async signOut(@Request() req, @Response({ passthrough: true }) res) {
        try {
            if (req.cookies["access_token"]) {
                res.setHeader(
                    "Set-Cookie",
                    `access_token=x; max-age=0; path=/;`
                );
            }

            return {
                result: true,
            };
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post("send-email-verification")
    async sendEmailVerification(@Request() req) {
        try {
            const user: User = req.user;
            return this.authService.sendEmailVerification(user.id, user.email);
        } catch (err) {
            throw err;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post("verify-email")
    async verifyEmail(@Request() req, @Body() { code }) {
        try {
            const user: User = req.user;
            return {
                result: await this.authService.verifyEmail(user.id, code),
            };
        } catch (err) {
            throw err;
        }
    }
}
