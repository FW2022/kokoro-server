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
    Query,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import { MessengerService } from "./messenger.service";
import { CreateMessengerDto } from "./dto/create-messenger.dto";
import { UpdateMessengerDto } from "./dto/update-messenger.dto";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { Roles } from "../auth/auth.decorator";
import { User } from "../user/entities/user.entity";
import {
    FindMessageDto,
    FindMessageRes,
    FindMessengerListDto,
    SendMessageDto,
} from "./dto/messenger.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Controller("api/messenger")
@UseGuards(JwtAuthGuard)
@Roles("EmailVerified")
export class MessengerController {
    constructor(
        private readonly messengerService: MessengerService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    @Post()
    createMessage(
        @Request() req,
        @Body() createMessengerDto: CreateMessengerDto
    ) {
        try {
            const user: User = req.user;
            return this.messengerService.create(user.id, createMessengerDto);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    @Get()
    async findMessengerList(
        @Request() req,
        @Query() args: FindMessengerListDto
    ) {
        try {
            const user: User = req.user;
            const userID = user.id;

            const result = await this.messengerService.findMessengerByUser(
                userID,
                args.targetUserID
            );

            return result;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    @Post("message")
    async sendMessage(@Request() req, @Body() args: SendMessageDto) {
        try {
            const user: User = req.user;

            const { message, users, msgUsers } =
                await this.messengerService.sendMessage(user, args);

            const messenger = {
                ...msgUsers[0].messenger,
                user: [msgUsers],
                message,
            };

            return { messenger, users };
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    @Get("message")
    async findMessage(@Request() req, @Query() args: FindMessageDto) {
        try {
            const user: User = req.user;
            const userID = user.id;

            const msgUsers = await this.messengerService.findUsersInfo(
                args.messengerID
            );
            const msgUser = msgUsers.find((v) => v.userID === userID);

            if (!msgUser) {
                throw new HttpException(
                    "Forbidden Messenger",
                    HttpStatus.FORBIDDEN
                );
            }

            const messages = await this.messengerService.findMessage({
                messengerID: args.messengerID,
            });

            const result = {
                msgUser,
                messages,
            };

            return result;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    @Get()
    findAll() {
        return this.messengerService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.messengerService.findOne(+id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateMessengerDto: UpdateMessengerDto
    ) {
        return this.messengerService.update(+id, updateMessengerDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.messengerService.remove(+id);
    }
}
