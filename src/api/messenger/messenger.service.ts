import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { CreateMessengerDto } from "./dto/create-messenger.dto";
import {
    FindMessageDto,
    FindMessageRes,
    SendMessageDto,
} from "./dto/messenger.dto";
import { UpdateMessengerDto } from "./dto/update-messenger.dto";
import { Messenger } from "./entities/messenger.entity";
import { MessengerText } from "./entities/messengerText.entity";
import { MessengerUser } from "./entities/messengerUser.entity";

@Injectable()
export class MessengerService {
    constructor(
        @InjectRepository(Messenger)
        private messengerRepository: Repository<Messenger>,
        @InjectRepository(MessengerUser)
        private messengerUserRepository: Repository<MessengerUser>,
        @InjectRepository(MessengerText)
        private messengerTextRepository: Repository<MessengerText>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async create(userID: string, { targetUserID }: CreateMessengerDto) {
        try {
            if (userID === targetUserID) {
                throw new HttpException(
                    "Equal userID with targetUserID",
                    HttpStatus.CONFLICT
                );
            }

            const isMessaging = await this.findMessengerByUser(
                userID,
                targetUserID
            );
            if (isMessaging.length > 0) {
                throw new HttpException(
                    "Already Messaging",
                    HttpStatus.CONFLICT
                );
            }

            const messenger = new Messenger();

            const user1 = new MessengerUser({
                messenger,
                userID,
            });

            const user2 = new MessengerUser({
                messenger,
                userID: targetUserID,
            });

            const users = [user1, user2];

            messenger.user = users;

            await this.messengerRepository.save(messenger);
            await this.messengerUserRepository.save(users);

            return messenger;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    /**
     * 한 명, 혹은 두 명이 같은 방을 찾습니다.
     */
    async findMessengerByUser(
        userID: string,
        withUserID?: string
    ): Promise<FindMessageRes[]> {
        try {
            let messengers = await this.messengerRepository
                .createQueryBuilder("messenger")
                .leftJoin("messenger.user", "user1")
                .where("user1.userID = :userID", { userID })
                .innerJoinAndSelect("messenger.user", "user2")
                .getMany();

            if (withUserID) {
                messengers = messengers.filter((chat) =>
                    chat.user.some((user) => user.id === withUserID)
                );
            }

            const availableUsers = await this.userRepository
                .createQueryBuilder("user")
                .leftJoin("user.following", "following")
                .leftJoin("user.follower", "follower")
                .where("following.id = follower.id")
                .innerJoin("user.following", "following2")
                .innerJoin("user.follower", "follower2")
                .getMany();

            const availableUserIDs = availableUsers
                .map((v) => v.id)
                .filter((v) => v !== userID);

            console.log("availableUserIDs", availableUserIDs);

            const result: FindMessageRes[] = [];

            for (const msg of messengers) {
                const msgTargetUser = msg.user.find((v) => v.userID !== userID);

                const targetUser = await this.userRepository.findOne(
                    msgTargetUser.userID
                );

                if (!targetUser) continue;
                if (!availableUserIDs.some((v) => v === targetUser.id))
                    continue;

                const message = await this.findMessage({
                    messengerID: msg.id,
                });

                result.push({
                    messenger: { ...msg, message },
                    targetUserInfo: {
                        ...targetUser,
                    },
                });
            }

            result.sort(
                (a, b) =>
                    (b.messenger.message[0]
                        ? b.messenger.message[0].createdAt.getTime()
                        : 0) -
                    (a.messenger.message[0]
                        ? a.messenger.message[0].createdAt.getTime()
                        : 0)
            );

            return result;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async findUsersInfo(messengerID: string) {
        try {
            const msgUsers = await this.messengerUserRepository.find({
                where: {
                    messenger: {
                        id: messengerID,
                    },
                },
                relations: ["messenger"],
            });

            return msgUsers;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async findMessage(args: FindMessageDto) {
        try {
            const { messengerID } = args;

            const messages = await this.messengerTextRepository.find({
                where: {
                    messenger: {
                        id: messengerID,
                    },
                },
                relations: ["messenger"],
                order: {
                    createdAt: "DESC",
                },
            });

            return messages;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async sendMessage(user: User, args: SendMessageDto) {
        try {
            const { text, messengerID } = args;
            const userID = user.id;

            const msgUsers = await this.findUsersInfo(messengerID);

            switch (true) {
                case msgUsers.length === 0:
                    throw new HttpException(
                        "Invalid Messenger",
                        HttpStatus.CONFLICT
                    );

                case !msgUsers.find((v) => v.userID === userID):
                    throw new HttpException(
                        "Access denied",
                        HttpStatus.FORBIDDEN
                    );
            }

            const messenger = msgUsers[0].messenger;

            const message = new MessengerText({
                userID,
                text,
                messenger,
            });

            const saveMessage = this.messengerTextRepository.save(message);

            const userIDs = msgUsers.map((v) => {
                v.unreadCount += 1;
                return v.userID;
            });

            const saveMsgUser = this.messengerUserRepository.save(msgUsers);

            const getUsers = this.userRepository.findByIds(userIDs);

            const [users] = await Promise.all([
                getUsers,
                saveMessage,
                saveMsgUser,
            ]);

            // const targetUsers = users.filter(v => v.id !== user.id)

            return { users, message, msgUsers };
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    findAll() {
        return `This action returns all messenger`;
    }

    findOne(id: number) {
        return `This action returns a #${id} messenger`;
    }

    update(id: number, updateMessengerDto: UpdateMessengerDto) {
        return `This action updates a #${id} messenger`;
    }

    remove(id: number) {
        return `This action removes a #${id} messenger`;
    }
}
