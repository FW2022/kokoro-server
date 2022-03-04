import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { User } from "../user/entities/user.entity";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import * as bcrypt from "bcryptjs";
import { EmailVerification } from "./entities/EmailVerification.entity";
import fakerStatic from "faker";
// import nodemailer from "nodemailer";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(EmailVerification)
        private readonly EmailVerificationRepository: Repository<EmailVerification>
    ) {}

    async signUp(userArg: CreateUserDto) {
        try {
            const { id, email } = userArg;

            const isAlreadyRegisted =
                (await this.userRepository.findOne({ id })) ||
                (await this.userRepository.findOne({ email }));

            // 유저가 이미 존재하는가?
            if (isAlreadyRegisted) {
                throw new HttpException(
                    "User already exist",
                    HttpStatus.CONFLICT
                );
            }

            const user = {
                ...new User(),
                ...userArg,
                password: await bcrypt.hash(userArg.password, 10),
            };

            await this.userRepository.save(user);

            user["token"] = this.jwtService.sign({
                username: user.id,
                password: user.password,
            });

            // await this.sendEmailVerification(user.id, user.email);

            return user;
        } catch (err) {
            throw err;
        }
    }

    async sendEmailVerification(userID: string, email?: string) {
        try {
            // const emailVerification =
            //     (await this.EmailVerificationRepository.findOne(userID)) ||
            //     new EmailVerification(userID);

            // emailVerification.code = `${fakerStatic.datatype.number({
            //     min: 0,
            //     max: 9999,
            //     precision: 4,
            // })}`;
            // emailVerification.expiredAt = new Date(
            //     new Date().getTime() + 3 * 60 * 1000
            // );

            // await this.EmailVerificationRepository.save(emailVerification);

            // const transporter = nodemailer.createTransport({
            //     service: "Gmail",
            //     host: process.env.EMAIL_HOST,
            //     port: 587,
            //     auth: {
            //         user: process.env.EMAIL_AUTH_EMAIL,
            //         pass: process.env.EMAIL_AUTH_PASSWORD,
            //     },
            // });

            // return await transporter.sendMail({
            //     from: process.env.EMAIL_FROM_USER_NAME,
            //     to: email,
            //     subject: "인증 관련 메일",
            //     text: `인증번호 : ${emailVerification.code}`,
            // });

            return this.verifyEmail(userID);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async verifyEmail(userID: string, code?: string) {
        try {
            // const emailVerification =
            //     await this.EmailVerificationRepository.findOne(userID);

            // if (emailVerification?.code !== code) {
            //     throw new HttpException(
            //         `Wrong code`,
            //         HttpStatus.NOT_ACCEPTABLE
            //     );
            // }

            // if (emailVerification?.expiredAt < new Date()) {
            //     throw new HttpException(
            //         `Expired code`,
            //         HttpStatus.NOT_ACCEPTABLE
            //     );
            // }

            await this.EmailVerificationRepository.delete(userID);

            const user = await this.userRepository.findOne(userID);
            if (!user.roles.some((v) => v === "EmailVerified")) {
                user.roles.push("EmailVerified");
                await this.userRepository.save(user);
                console.log(user);
                return user;
            }

            console.log("verify user", user);

            throw new HttpException(
                "Already verified email",
                HttpStatus.CONFLICT
            );
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}
