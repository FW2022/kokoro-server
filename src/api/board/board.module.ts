import { Module } from "@nestjs/common";
import { BoardService } from "./board.service";
import { BoardController } from "./board.controller";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Board } from "./entities/board.entity";
import { User } from "../user/entities/user.entity";
import { BullModule } from "@nestjs/bull";
import { BoardProcessor } from "./board.processor";

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
    providers: [BoardService, BoardProcessor],
    exports: [BoardService],
})
export class BoardModule {}
