import { Module } from "@nestjs/common";
import { BoardService } from "./board.service";
import { BoardController } from "./board.controller";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Board } from "./entities/board.entity";
import { User } from "../user/entities/user.entity";
import { BullModule } from "@nestjs/bull";
import { BoardProcessor } from "./board.processor";
import { BoardResolver } from "./board.resolver";
import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis from "ioredis";

@Module({
    imports: [
        MulterModule.register(),
        TypeOrmModule.forFeature([Board, User]),
        BullModule.registerQueue({
            name: "meeting",
            defaultJobOptions: {
                removeOnComplete: true,
            },
        }),
    ],
    controllers: [BoardController],
    providers: [
        BoardService,
        BoardProcessor,
        BoardResolver,
        {
            provide: "PUB_SUB",
            useFactory: () => {
                return new RedisPubSub({
                    publisher: new Redis({
                        host: process.env.REDIS_HOST,
                        port: Number(process.env.REDIS_PORT),
                        password: process.env.REDIS_PASS,
                    }),
                    subscriber: new Redis({
                        host: process.env.REDIS_HOST,
                        port: Number(process.env.REDIS_PORT),
                        password: process.env.REDIS_PASS,
                    }),
                });
            },
        },
    ],
    exports: [BoardService],
})
export class BoardModule {}
