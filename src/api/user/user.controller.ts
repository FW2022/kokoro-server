import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserFindOneDto } from "./dto/user.dto";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { FollowDto } from "../messenger/dto/messenger.dto";
import { User } from "./entities/user.entity";

@Controller("api/user")
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    getUser(@Request() req) {
        // console.log("getUser", req.user);
        return req.user;
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get("all")
    findAll() {
        return this.userService.findAll();
    }

    @Get("follow")
    findFollowList(@Request() req) {
        try {
            const user: User = req.user;
            return this.findFollowList(user.id);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    @Post("follow")
    async follow(@Request() req, @Body() args: FollowDto) {
        try {
            const user: User = req.user;
            return await this.userService.follow(user.id, args);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    @Get(":id")
    findOne(@Body() args: UserFindOneDto) {
        return this.userService.findOne(args);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(+id, updateUserDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.userService.remove(+id);
    }
}
