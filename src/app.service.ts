import { Injectable } from "@nestjs/common";
import { RenderableResponse } from "nest-next";
import { BoardService } from "./api/board/board.service";
import { FindAllArgDto } from "./api/board/dto/board.dto";
import { AuthStatus } from "./api/user/user.types";
import { RouteIndexDto } from "./app.dto";

@Injectable()
export class AppService {
    constructor(private readonly boardService: BoardService) {}

    async routeIndex(args: RouteIndexDto) {
        try {
            const { authStatus, res, query, user } = args;

            if (authStatus.isEmailVerified) {
                const boardResult = await this.boardService.findAll(
                    query ?? new FindAllArgDto()
                );

                return res.render("Home", {
                    board: boardResult[0],
                    boardLength: boardResult[1],
                    user,
                } as any);
            }

            return res.render("Index", {
                ...authStatus,
            } as any);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async findBoard(id: string) {
        return this.boardService.findOne(id);
    }
}
