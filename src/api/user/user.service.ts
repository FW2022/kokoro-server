import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import axiosInstance from "../../../pages/lib/axiosInstance";
import { getBearerToken } from "../../lib/token";
import { FollowDto } from "../messenger/dto/messenger.dto";
import { MessengerService } from "../messenger/messenger.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserFindOneDto } from "./dto/user.dto";
import { User } from "./entities/user.entity";
import { AuthStatus } from "./user.types";

@Injectable()
export class UserService {
    constructor(
        private readonly messengerService: MessengerService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    getAuthStatus(user: User): AuthStatus {
        return {
            isAuth: !!user,
            isEmailVerified: user
                ? user.roles.some((v) => v === "EmailVerified")
                : false,
            email: user?.email,
        };
    }

    getUserByHttp(req): Promise<User> {
        return axiosInstance()
            .get("http://127.0.0.1:8053/api/user", {
                headers: {
                    authorization: getBearerToken(req),
                },
            })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    create(createUserDto: CreateUserDto) {
        try {
            const user = { ...new User(), ...createUserDto };
            return this.userRepository.save(user);
        } catch (err) {
            throw err;
        }
    }

    async follow(userID: string, args: FollowDto) {
        try {
            const { targetUserID } = args;

            const users = await this.userRepository.findByIds(
                [userID, targetUserID],
                {
                    relations: ["following", "follower"],
                }
            );

            const user = users.find((v) => v.id === userID);
            const targetUser = users.find((v) => v.id === targetUserID);

            const isFollowing = user.following.some(
                (v) => v.id === targetUserID
            );
            if (isFollowing) {
                user.following = user.following.filter(
                    (v) => v.id !== targetUserID
                );
                // targetUser.follower.filter((v) => v.id !== userID);
            } else {
                user.following.push(targetUser);
                // targetUser.follower.push(user);
                if (user.follower.some((v) => v.id === targetUserID)) {
                    this.messengerService.create(userID, { targetUserID });
                }
            }

            return await this.userRepository.save(user);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    findFollowList(userID: string) {
        try {
            return this.userRepository.findOne(userID, {
                relations: ["following", "follower"],
            });
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    findAll() {
        try {
            return this.userRepository.find({
                skip: 0,
                take: 50,
            });
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    findOne(args: UserFindOneDto) {
        try {
            return this.userRepository.findOne({ where: args });
        } catch (err) {
            throw err;
        }
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
