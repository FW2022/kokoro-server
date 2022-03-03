import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../user/entities/user.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private jwtService: JwtService
    ) {
        super();
    }

    // usename = id
    async validate(username: string, password: string): Promise<any> {
        try {
            const user =
                (await this.userRepository.findOne({ id: username })) ||
                (await this.userRepository.findOne({ email: username }));

            switch (true) {
                case !user:
                    throw Error("User Not Found");
            }

            const isValidPassword = await bcrypt.compare(
                password,
                user.password
            );

            if (!isValidPassword) throw new Error("Password is wrong");

            user["token"] = this.jwtService.sign({
                username,
                password: user.password,
            });

            delete user.password;
            return user;
        } catch (err) {
            console.log(err);
            if (err instanceof Error) {
                const { message } = err;
                switch (true) {
                    case message === "User Not Found":
                        throw new HttpException(
                            `User Not Found`,
                            HttpStatus.UNAUTHORIZED
                        );

                    case message === "Password is wrong":
                        throw new HttpException(
                            `Password is wrong`,
                            HttpStatus.UNAUTHORIZED
                        );
                }
            }
            throw err;
        }
    }
}
