import spawnAsync from "@expo/spawn-async";
import {
    Controller,
    Get,
    Query,
    Render,
    Request,
    Response,
} from "@nestjs/common";
import { RenderableResponse } from "nest-next";
import { join } from "path";
import { FindAllArgDto } from "./api/board/dto/board.dto";
import { MessengerService } from "./api/messenger/messenger.service";
import { UserService } from "./api/user/user.service";
import { AppService } from "./app.service";

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly userService: UserService,
        private readonly messengerService: MessengerService
    ) {}

    @Get()
    async index(
        @Request() req,
        @Response({ passthrough: true }) res: RenderableResponse
    ) {
        try {
            const user = await this.userService.getUserByHttp(req);

            const authStatus = this.userService.getAuthStatus(user);

            return this.appService.routeIndex({ authStatus, res, user });
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    @Get("account")
    @Render("Account")
    account(@Request() req) {
        return {
            title: "Test",
        };
    }

    @Get("profile")
    async profile(
        @Request() req,
        @Response({ passthrough: true }) res: RenderableResponse
    ) {
        let user = await this.userService.getUserByHttp(req);
        const authStatus = this.userService.getAuthStatus(user);

        if (!authStatus.isEmailVerified) {
            return this.appService.routeIndex({ authStatus, res, user });
        }

        user = await this.userService.findFollowList(user.id);

        return res.render("Profile", {
            username: user.id,
            user,
        } as any);
    }

    @Get("home")
    async home(
        @Request() req,
        @Response({ passthrough: true }) res: RenderableResponse,
        @Query() query: FindAllArgDto
    ) {
        try {
            const user = await this.userService.getUserByHttp(req);
            const authStatus = this.userService.getAuthStatus(user);

            return this.appService.routeIndex({ authStatus, res, query, user });
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    @Get("new")
    async new(
        @Request() req,
        @Response({ passthrough: true }) res: RenderableResponse
    ) {
        const user = await this.userService.getUserByHttp(req);
        const authStatus = this.userService.getAuthStatus(user);

        if (!authStatus.isEmailVerified) {
            return this.appService.routeIndex({ authStatus, res });
        }

        return res.render("New", {
            // title: "Nest with Next",
        });
    }

    @Get("edit")
    async edit(
        @Request() req,
        @Response({ passthrough: true }) res: RenderableResponse,
        @Query("id") id: string
    ) {
        const user = await this.userService.getUserByHttp(req);
        const authStatus = this.userService.getAuthStatus(user);

        if (!authStatus.isEmailVerified) {
            return this.appService.routeIndex({ authStatus, res });
        }

        return res.render("Edit", {
            id,
            board: await this.appService.findBoard(id),
        } as any);
    }

    @Get("follow")
    async follow(
        @Request() req,
        @Response({ passthrough: true }) res: RenderableResponse
    ) {
        let user = await this.userService.getUserByHttp(req);
        const authStatus = this.userService.getAuthStatus(user);

        if (!authStatus.isEmailVerified) {
            return this.appService.routeIndex({ authStatus, res });
        }

        user = await this.userService.findFollowList(user.id);

        const userList = await this.userService.findAll();

        return res.render("Follow", {
            user,
            userList,
        } as any);
    }

    @Get("msg")
    async msg(
        @Request() req,
        @Response({ passthrough: true }) res: RenderableResponse
    ) {
        let user = await this.userService.getUserByHttp(req);
        const authStatus = this.userService.getAuthStatus(user);

        if (!authStatus.isEmailVerified) {
            return this.appService.routeIndex({ authStatus, res });
        }

        user = await this.userService.findFollowList(user.id);

        const messenger = await this.messengerService.findMessengerByUser(
            user.id
        );

        return res.render("Msg", {
            user,
            messenger,
        } as any);
    }
}
