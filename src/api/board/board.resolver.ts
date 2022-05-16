import { Inject } from "@nestjs/common";
import {
    Args,
    Int,
    Mutation,
    Query,
    Resolver,
    Subscription,
} from "@nestjs/graphql";
import { PubSubEngine } from "graphql-subscriptions";
import { BoardService } from "./board.service";
import { FindAllArgDto } from "./dto/board.dto";
import { Board } from "./entities/board.entity";
import dirTree from "directory-tree";
import { join } from "path";

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

    @Query((type) => String, { description: "음악 경로 불러오기" })
    async getMusicPath(): Promise<any> {
        const tree = dirTree(
            `${join(
                __dirname,
                "..",
                "..",
                "..",
                "..",
                "..",
                "public",
                "scrapes"
            )}`
        );

        return JSON.stringify(tree);
    }

    @Mutation((type) => Boolean)
    async sendMusic(
        @Args("notes", { type: () => [Int] }) notes: number[]
    ): Promise<boolean> {
        return this.boardService.sendMusic(notes);
    }

    @Mutation((type) => String)
    async setPlace(
        @Args("place", { type: () => String }) place: string
    ): Promise<string> {
        this.pubsub.publish("subPlace", { subPlace: place });
        return place;
    }

    @Mutation((type) => [String])
    async setShape(
        @Args("shape", { type: () => [String] }) shape: string[]
    ): Promise<string[]> {
        this.pubsub.publish("subShape", { subShape: shape });
        return shape;
    }

    @Subscription((type) => Board)
    subBoard() {
        return this.pubsub.asyncIterator("subBoard");
    }

    @Subscription((type) => String)
    subMusic() {
        return this.pubsub.asyncIterator("subMusic");
    }

    @Subscription((type) => String)
    subPlace() {
        return this.pubsub.asyncIterator("subPlace");
    }

    @Subscription((type) => [String])
    subShape() {
        return this.pubsub.asyncIterator("subShape");
    }
}
