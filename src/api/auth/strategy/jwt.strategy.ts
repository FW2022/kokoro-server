import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { jwtConstants, JwtPayload } from "../../../config/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../user/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    async validate(payload: JwtPayload) {
        try {
            const { username, password } = payload;
            const user =
                (await this.userRepository.findOne({ id: username })) ||
                (await this.userRepository.findOne({ email: username }));

            switch (true) {
                case user == undefined:
                    throw Error("User Not Found");

                case password != user.password:
                    throw Error("Wrong token in password");
            }

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

                    case message === "Wrong token in password":
                        throw new HttpException(
                            `Wrong token in password`,
                            HttpStatus.UNAUTHORIZED
                        );
                }
            }
            throw err;
        }
    }
}
