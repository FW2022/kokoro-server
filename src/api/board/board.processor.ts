import * as fs from "fs";
import { join } from "path";
import { Job } from "bull";
import { Repository } from "typeorm";
import { PubSubEngine } from "graphql-subscriptions";
import { Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Process, Processor } from "@nestjs/bull";
import spawnAsync from "@expo/spawn-async";
import { Board } from "./entities/board.entity";
import { parse } from "csv-parse/sync";
import { BoardService } from "./board.service";

@Processor("meeting")
export class BoardProcessor {
    constructor(
        @InjectRepository(Board)
        private readonly boardRepository: Repository<Board>,
        @Inject("PUB_SUB") private pubsub: PubSubEngine,
        private readonly boardService: BoardService
    ) {}

    @Process("color")
    async color(job: Job) {
        try {
            const { filename, boardID } = job.data;

            console.log(`Get ${filename}`);

            if (
                !fs.existsSync(
                    `${join(
                        __dirname,
                        "..",
                        "..",
                        "..",
                        "..",
                        "..",
                        "public",
                        `${filename.split(".")[0]}.csv`
                    )}`
                )
            ) {
                console.log(`Processing... ${filename}`);
                console.log(`${join(__dirname, "..", "..", "..", "..", "..")}`);
                const root = `${join(__dirname, "..", "..", "..", "..", "..")}`;
                const spawnPromise = spawnAsync(`bash`, [
                    `${root}/getColor.sh`,
                    `${root}/public/${filename}`,
                    `${root}/public/${`${filename.split(".")[0]}.csv`}`,
                ]);

                const child = spawnPromise.child;

                child.stdout.on("data", (data) => {
                    console.log(data);
                });

                await Promise.all([spawnPromise]);

                console.log(`Success ${filename}`);
                console.log(spawnPromise);

                const board = await this.boardRepository.findOne(boardID);
                const csv = fs.readFileSync(
                    `${join(
                        __dirname,
                        "..",
                        "..",
                        "..",
                        "..",
                        "..",
                        "public",
                        `${filename.split(".")[0]}.csv`
                    )}`
                );
                const csvData = parse(csv.toString("utf-8"));
                console.log(csvData);
                board.primaryColor = csvData[1][0];
                board.secondaryColor = csvData[1][1];
                board.therapeuticColor = csvData[1][2];
                await this.boardRepository.save(board);

                this.pubsub.publish("subBoard", { subBoard: board });

                return;
            } else {
                console.log(
                    `${join(
                        __dirname,
                        "..",
                        "..",
                        "..",
                        "..",
                        "..",
                        "public",
                        `${filename.split(".")[0]}.csv`
                    )} alrady exists`
                );
                return;
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    @Process("music")
    async music(job: Job) {
        try {
            const { notes } = job.data;

            console.log(`${join(__dirname, "..", "..", "..", "..", "..")}`);
            const root = `${join(__dirname, "..", "..", "..", "..", "..")}`;
            const spawnPromise = spawnAsync(`bash`, [
                `${root}/getMusic.sh`,
                notes.join(","),
            ]);

            const [spawnResult] = await Promise.all([spawnPromise]);

            console.log(spawnResult);

            let result: string = spawnResult.stdout;
            result = result.split("Result : ")[1];
            result = result.split("\n")[0];

            console.log(result);

            this.pubsub.publish("subMusic", { subMusic: result });

            const boards = await this.boardService.findAll({
                skip: 0,
                take: 1,
            });
            const board = boards[0][0];

            board.music = result;
            this.boardRepository.save(board);

            return;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}
