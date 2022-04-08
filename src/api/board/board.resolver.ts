import { Inject } from "@nestjs/common";
import { Int, Query, Resolver, Subscription } from "@nestjs/graphql";
import { PubSubEngine } from "graphql-subscriptions";
import { BoardService } from "./board.service";
import { FindAllArgDto } from "./dto/board.dto";
import { Board } from "./entities/board.entity";

@Resolver()
export class BoardResolver {
    constructor(
        @Inject("PUB_SUB") private pubsub: PubSubEngine,
        private readonly boardService: BoardService
    ) {}

    @Query((type) => [Board], { description: "최근 내용 불러오기" })
    async getBoard(): Promise<Board[]> {
        const result = await this.boardService.findAll({ skip: 0, take: 1 });
        return result[0];
    }

    @Subscription((type) => Board)
    subBoard() {
        return this.pubsub.asyncIterator("subBoard");
    }
}
